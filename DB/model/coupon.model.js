import { model, Schema, Types } from 'mongoose';
const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    amount: { type: Number, required: true },
    usedBy: [{
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }],
    expireDate: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' }
}, {
    timestamps: true,
});

const couponModel = model('Coupon', couponSchema);
export default couponModel;