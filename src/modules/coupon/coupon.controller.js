import couponModel from "../../../DB/model/coupon.model.js"

export const createCoupon = async (req, res, next) => {
    if (await couponModel.findOne({ name: req.body.name })) {
        return res.status(409).json({ message: 'Coupon name already exists' });
    }
    req.body.expireDate = new Date(req.body.expireDate);
    req.body.createdBy = req.user._id;
    const coupon = await couponModel.create(req.body);
    return res.status(201).json({ message: 'Coupon created successfully', coupon });
}

