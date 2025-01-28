import { model, Schema, Types } from 'mongoose';
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    slug: {
        type: String,
        required: true,
    },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
categorySchema.virtual("subCategories", {
    localField: "_id",
    foreignField: "categoryId",
    ref: "Subcategory"
});

const categoryModel = model('Category', categorySchema);
export default categoryModel;