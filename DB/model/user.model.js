import { model, Schema } from 'mongoose';
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
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
    image:{
        type: Object,
    },
    phoneNumber: String,
    address: String,
    age: Number,
    confirmEmail: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    status:{
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'active'
    },
    role:{
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    }
}, {
    timestamps: true
});

const userModel = model('User', userSchema);
export default userModel;