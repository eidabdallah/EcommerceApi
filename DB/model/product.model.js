import { model, Schema, Types } from 'mongoose';
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: { type: String, required: true, },
    description: { type: String, required: true },
    stock: { type: Number, default: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: {
        type: Number,
        defaultValue: 0
    },
    mainImage: { type: Object, required: true },
    subImages: [{ type: Object, required: true }],
    status: {
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    size: [{
        type: String,
        enum: ['Small', 'Medium', 'Large', 'xlarge', 'xxlarge'],
    }],
    colors: [String],
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Types.ObjectId, ref: 'Subcategory', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('reviews' , {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId',
});

const productModel = model('Product', productSchema);
export default productModel;