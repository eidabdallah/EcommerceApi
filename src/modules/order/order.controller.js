import cartModel from './../../../DB/model/cart.model.js';
import couponModel from './../../../DB/model/coupon.model.js';
import orderModel from './../../../DB/model/order.model.js';
import productModel from './../../../DB/model/product.model.js';
import userModel from './../../../DB/model/user.model.js';

export const createOrder = async (req, res, next) => {

    // check if have product in cart
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: 'Cart is Empty.' });
    }
    // if the user have product in cart , put the product in req.body.product
    req.body.products = cart.products;

    // Check if the coupon has expired or not. 
    // If it hasn't expired, verify if the coupon is still valid.
    if (req.body.couponName) {
        const coupon = await couponModel.findOne({ name: req.body.couponName });
        if (!coupon || coupon.expireDate < new Date()) {
            return res.status(400).json({ message: 'Coupon is invalid or expired.' });
        }
        if (coupon.usedBy.toString().includes(req.user._id.toString())) {
            return res.status(409).json({ message: 'Coupon already used' });
        }
        req.body.coupon = coupon;
    }

    let finalProductList = [];
    let subTotal = 0;
    for (let product of req.body.products) {
        // check product quantity
        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } });
        if (!checkProduct) {
            return res.status(400).json({ message: 'Not enough stock for some products.' });
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
    }



}
// for admin
export const getAllOrder = async (req, res, next) => {
    const orders = await orderModel.find({ $or: [{ status: 'pending' }, { status: 'confirmed' }] });
    if (orders.length > 0)
        return res.status(200).json({ message: 'All orders retrieved successfully', orders });
    return res.status(404).json({ message: 'There are no orders.' });
}
// for admin
export const changeStatusOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const validStatuses = ["pending", "cancelled", "confirmed", "onway", "delivered"];
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({ message: "Invalid status value. Allowed values: pending, cancelled, confirmed, onway, delivered" });
    }
    const order = await orderModel.findById(orderId);
    if (!order)
        return res.status(404).json({ message: 'Order not found.' });
    if (order.status == "delivered") {
        return res.status(400).json({ message: "Cannot update a delivered order." });
    }
    if (order.status == "onway" && newStatus != "delivered") {
        return res.status(400).json({ message: "An order in 'onway' status can only be changed to 'delivered'." });
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
    return res.status(404).json({ message: 'There are no orders.' });
}