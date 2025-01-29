import cartModel from './../../../DB/model/cart.model.js';
import productModel from './../../../DB/model/product.model.js';

export const getCart = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart)
        return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ message: 'Success', products : cart.products });
}
export const createCart = async (req, res, next) => {
    const { productId } = req.body;
    const checkProduct = await productModel.findById(productId);
    if (!checkProduct)
        return res.status(404).json({ message: 'Product not found' });

    const cart = await cartModel.findOne({ userId: req.user._id });
    // if dosen't have cart then create a new cart
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: { productId },
        });
        res.status(201).json({ message: 'Product added to cart', cart: newCart });
    }
    // if have cart already been created , need to check if it exists or not .
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId == productId) {
            return res.status(400).json({ message: 'Product already exists in cart' });
        }
    }
    cart.products.push({ productId });
    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
}

export const deleteProductFromCart = async (req, res, next) => {
    const { productId } = req.params;
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || !cart.products.some(product => product.productId.toString() === productId))
        return res.status(404).json({ message: !cart ? 'Cart not found' : 'Product not found in cart' });

    const updatedCart = await cartModel.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { products: { productId } } },
        { new: true }
    );
    res.status(200).json({ message: 'Product removed from cart', updatedCart });
}

export const clearCart = async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        {userId: req.user._id},
        { products: [] },
        { new: true }
    );
    res.status(200).json({ message: 'Cart cleared', cart });
}

export const updateProductQuantity = async (req, res, next) => {
    const { operator, quantity } = req.body;
    const inc = (operator === "+") ? quantity : -quantity;

    const cart = await cartModel.findOneAndUpdate(
        { userId: req.user._id, "products.productId": req.params.productId },
        { $inc: { "products.$.quantity": inc } },
        { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // if quantity is 0 or less , delete product from cart
    const product = cart.products.find(p => p.productId.toString() === req.params.productId);
    if (product && product.quantity <= 0) {
        await cartModel.findOneAndUpdate(
            { userId: req.user._id },
            { $pull: { products: { productId: req.params.productId } } },
            { new: true }
        );
    }

    res.status(200).json({ message: "Product quantity updated", cart });
};
