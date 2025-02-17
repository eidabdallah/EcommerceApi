import reviewModel from '../../../DB/model/review.model.js';
import orderModel from './../../../DB/model/order.model.js';
import cloudinary from './../../utils/cloudinary.js';
import { AppError } from './../../utils/AppError.js';

export const createReview = async (req, res, next) => {
    const { productId } = req.params;

    // Check if the user has bought this product or not
    const order = await orderModel.findOne({
        userId: req.user._id, status: 'delivered',
        "products.productId": productId,
    });
    if (!order) {
        return next(new AppError("Can't review this product", 403));
    }
    // check if the user has reviewed this product before .
    const checkReview = await reviewModel.findOne({
        userId: req.user._id,
        productId: productId,
    });
    if (checkReview) {
        return next(new AppError("You've already reviewed this product", 409));
    }
    // if send pic review , save in database
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/${productId}/review`,
        });
        req.body.image = { secure_url, public_id };
    }
    const review = await reviewModel.create({ ...req.body, userId: req.user._id, productId });
    return res.status(201).json({ message: 'Review created successfully', review });
}
