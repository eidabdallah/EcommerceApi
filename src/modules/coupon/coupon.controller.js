import couponModel from "../../../DB/model/coupon.model.js"

export const createCoupon = async (req, res, next) => {
    if (await couponModel.findOne({ name: req.body.name })) {
        return res.status(409).json({ message: 'Coupon name already exists' });
    }
    if (req.body.expireDate) {
        let newExpireDate = new Date(req.body.expireDate);
        if (newExpireDate < Date.now())
            return res.status(400).json({ message: 'Coupon cannot be expired before the current date' });
        req.body.expireDate = newExpireDate;
    }
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
    return res.status(404).json({ message: 'No coupons found' });
}
export const updateCoupon = async (req, res, next) => {
    const { amount, expireDate } = req.body;
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon)
        return res.status(404).json({ message: 'Coupon not found' });
    if (coupon && (expireDate || amount)) {
        if (expireDate) {
            let newExpireDate = new Date(expireDate);
            if (newExpireDate < Date.now())
                return res.status(400).json({ message: 'Coupon cannot be expired before the current date' });
            coupon.expireDate = newExpireDate;
        }
        if (amount) {
            if (amount <= 0)
                return res.status(400).json({ message: 'Coupon amount can not be less than or equal to zero' });
            coupon.amount = amount;
        }
        coupon.updatedBy = req.user._id;
        await coupon.save();
        return res.status(200).json({ message: 'Coupon updated successfully', coupon });
    }
    return res.status(400).json({ message: 'No updates provided' });
}

export const deleteCoupon = async (req, res, next) => {
    const coupon = await couponModel.findByIdAndDelete(req.params.id);
    if (!coupon)
        return res.status(404).json({ message: 'Coupon not found' });
    return res.status(200).json({ message: 'Coupon deleted successfully' });
}
export const getCouponById = async (req, res, next) => {
    const coupon = await couponModel.findById(req.params.id);
    if (!coupon)
        return res.status(404).json({ message: 'Coupon not found' });
    return res.status(200).json({ message: 'Coupon retrieved successfully', coupon });
}
