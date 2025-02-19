import couponModel from "../../../DB/model/coupon.model.js"
import { AppError } from './../../utils/AppError.js';

export const createCoupon = async (req, res, next) => {
    if (await couponModel.findOne({ name: req.body.name })) {
        return next(new AppError('Coupon name already exists', 409));
    }
    req.body.expireDate = new Date(req.body.expireDate);
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const coupon = await couponModel.create(req.body);
    return res.status(201).json({ message: 'Coupon created successfully', coupon });
}

export const getAllCoupons = async (req, res, next) => {
    const coupons = await couponModel.find({});
    if (coupons.length > 0) {
        return res.status(200).json({ message: ' all coupon', coupons });
    }
    return next(new AppError('No coupons found', 404));
}
export const updateCoupon = async (req, res, next) => {
    const { amount, expireDate } = req.body;
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon)
        return next(new AppError('Coupon not found', 404));
    if (coupon && (expireDate || amount)) {
        if (expireDate) {
            let newExpireDate = new Date(expireDate);
            if (newExpireDate < Date.now())
                return next(new AppError('Coupon cannot be expired before the current date', 400));
            coupon.expireDate = newExpireDate;
        }
        if (amount) {
            if (amount <= 0)
                return next(new AppError('Coupon amount cannot be less than or equal to zero', 400));
            coupon.amount = amount;
        }
        coupon.updatedBy = req.user._id;
        await coupon.save();
        return res.status(200).json({ message: 'Coupon updated successfully', coupon });
    }
    return next(new AppError('No updates provided', 400));
}

export const deleteCoupon = async (req, res, next) => {
    const coupon = await couponModel.findByIdAndDelete(req.params.id);
    if (!coupon)
        return next(new AppError('Coupon not found', 404));
    return res.status(200).json({ message: 'Coupon deleted successfully' });
}

export const getCouponById = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon)
        return next(new AppError('Coupon not found', 404));
    return res.status(200).json({ message: 'Coupon retrieved successfully', coupon });
}
