import cartModel from './../../../DB/model/cart.model.js';
import couponModel from './../../../DB/model/coupon.model.js';
import orderModel from './../../../DB/model/order.model.js';
import productModel from './../../../DB/model/product.model.js';
import userModel from './../../../DB/model/user.model.js';
import { AppError } from './../../utils/AppError.js';

export const createOrder = async (req, res, next) => {

    // check if have product in cart
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || cart.products.length === 0) {
        return next(new AppError('Cart is Empty.', 400));
    }
    // if the user have product in cart , put the product in req.body.product
    req.body.products = cart.products;

    // Check if the coupon has expired or not. 
    // If it hasn't expired, verify if the coupon is still valid.
    if (req.body.couponName) {
        const coupon = await couponModel.findOne({ name: req.body.couponName });
        if (!coupon || coupon.expireDate < new Date()) {
            return next(new AppError('Coupon is invalid or expired.', 400));
        }
        if (coupon.usedBy.toString().includes(req.user._id.toString())) {
            return next(new AppError('Coupon already used', 409));
        }
        req.body.coupon = coupon;
    }

    let finalProductList = [];
    let subTotal = 0;
    for (let product of req.body.products) {
        // check product quantity
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
        if (!checkProduct) {
            return next(new AppError('Not enough stock for some products.', 400));
        }
        product = product.toObject();
        product.productName = checkProduct.name;
        product.unitPrice = checkProduct.price;
        product.finalPrice = product.quantity * checkProduct.finalPrice;
        subTotal += product.finalPrice;
        finalProductList.push(product);
    }
    // address and phone number for user : 
    // if doesn't send him in req.body , use the user information in database
    const user = await userModel.findById(req.user._id);
    if (!req.body.address)
        req.body.address = user.address;
    if (!req.body.phoneNumber)
        req.body.phoneNumber = user.phoneNumber;

    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        totalPrice: subTotal - ((subTotal * (req.body.coupon?.amount || 0)) / 100),
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        updatedBy: req.user._id
    });

    if (order) {
        // decrease quantity : 
        for (const product of req.body.products) {
            await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } });
        }
        // if coupon is used , add user id to usedBy array in coupon model.
        if (req.body.coupon) {
            await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
        }
        //remove product from cart
        await cartModel.updateOne({ userId: req.user._id }, { products: [] });
        return res.status(201).json({ message: 'Order created successfully', order })
    } else {
        return next(new AppError('Order creation failed.', 500));
    }



}
// for admin
export const getAllOrder = async (req, res, next) => {
    const { status } = req.query;
    const orders = await orderModel.find({ status: status }).populate("products.productId");
    if (orders.length > 0)
        return res.status(200).json({ message: 'All orders retrieved successfully', orders });
    return next(new AppError('There are no orders.', 404));
}
// for admin
export const changeStatusOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order)
        return next(new AppError('Order not found.', 404));
    if (order.status == "delivered") {
        return next(new AppError('Cannot update a delivered order.', 400));
    }
    const validTransitions = {
        "pending": ["cancelled", "confirmed"],
        "confirmed": ["onway"],
        "onway": ["delivered"]
    };
    if (!validTransitions[currentStatus].includes(newStatus)) {
        return next(new AppError(`An order in '${currentStatus}' can only be changed to ${validTransitions[currentStatus].join(' or ')}.`, 400));
    }

    if (order.status == "pending" && newStatus == "cancelled") {
        for (const product of order.products) {
            await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: product.quantity } });
        }
        if (req.body.coupon) {
            await couponModel.updateOne({ _id: req.body.coupon._id }, { $pull: { usedBy: req.user._id } })
        }
    }
    order.updatedBy = req.user._id;
    order.status = newStatus;
    await order.save();


    return res.status(200).json({ message: 'Order status updated successfully', order });
}

export const getAllOrderForUser = async (req, res, next) => {
    const orders = await orderModel.find({ userId: req.user._id });
    if (orders.length > 0)
        return res.status(200).json({ message: 'All orders retrieved successfully', orders });
    return next(new AppError('There are no orders.', 404));
}