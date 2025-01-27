import { model, Schema, Types } from 'mongoose';
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: Object,
        required: true
    },
    status:{
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    slug:{
        type: String,
        required: true, 
    },
    createdBy:{ type:Types.ObjectId, ref: 'User'},
    updatedBy:{ type:Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
});

const categoryModel = model('Category', categorySchema);
export default categoryModel;