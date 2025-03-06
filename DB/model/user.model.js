import { model, Schema } from 'mongoose';
import { mongoose } from 'mongoose';
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Object,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    address: String,
    confirmEmail: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    status: {
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    sendCode: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;