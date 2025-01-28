import { model, Schema, Types } from 'mongoose';
const subCategorySchema = new Schema({
    name: { type: String, required: true, unique: true, },
    image: { type: Object, required: true },
    status: {
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    slug: { type: String, required: true, },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});
const subCategoryModel = model('Subcategory', subCategorySchema);
export default subCategoryModel;