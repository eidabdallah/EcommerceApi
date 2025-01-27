import { model, Schema, Types } from 'mongoose';
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image:{
        type: Object,
        required: true
    },
    status:{
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'active'
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    createdBy:{ type:Types.ObjectId, ref: 'User', required: true},
    updatedBy:{ type:Types.ObjectId, ref: 'User', required: true},
}, {
    timestamps: true
});

const categoryModel = model('Category', categorySchema);
export default categoryModel;