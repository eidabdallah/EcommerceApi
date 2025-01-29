import { model, Schema, Types } from 'mongoose';
const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    products: [{
        productName: { type: String, required: true},
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
    }],
    totalPrice: { type: Number, required: true, },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentType: { type: String, enum: ['cash', "card"], default: 'cash' },
    status: {
        type: String,
        enum: ['pending', 'cancelled', 'confirmed', 'onway', 'delivered'],
        default: 'pending'
    },
    notes: { type: String },
    rejectedReason: { type: String },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    couponId: { type: Types.ObjectId, ref: 'Coupon' }
}, {
    timestamps: true,
});

const orderModel = model('Order', orderSchema);
export default orderModel;