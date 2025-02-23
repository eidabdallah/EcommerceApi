import userModel from "../../../DB/model/user.model.js";
import cartModel from './../../../DB/model/cart.model.js';
import bcrypt from 'bcryptjs';
import { AppError } from './../../utils/AppError.js';
import cloudinary from './../../utils/cloudinary.js';

export const getAllUser = async (req, res, next) => {
    const users = await userModel.find({}).select("-password -sendCode");
    if (users.length > 0)
        return res.status(200).json({ message: 'All users retrieved successfully', users });
    return next(new AppError('There are no users.', 404));
}

export const getUserInformation = async (req, res, next) => {
    const user = await userModel.findById(req.user._id).select("userName email phoneNumber address");
    if (!user)
        return next(new AppError('User not found', 404));

    return res.status(200).json({ message: "User retrieved successfully", user });
};

export const deleteUser = async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user)
        return next(new AppError('User not found', 404));
    await cartModel.deleteMany({ userId: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
};

export const updateUserStatus = async (req, res, next) => {
    const { status } = req.body;

    const user = await userModel.findById(req.params.id);
    if (!user)
        return next(new AppError('User not found', 404));

    if (!["Active", "NotActive"].includes(status))
        return next(new AppError('Invalid status value', 400));


    user.status = status;
    await user.save();
    return res.status(200).json({ message: `User status updated to ${status}` });
};

export const updateUserInformation = async (req, res, next) => {
    const { userName, phoneNumber, address } = req.body;
    let updateFields = {};

    const user = await userModel.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (userName) updateFields.userName = userName;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (address) updateFields.address = address;

    if (req.file) {
        if (user.image && user.image.public_id) {
            await cloudinary.uploader.destroy(user.image.public_id);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/users`
        });

        updateFields.image = { secure_url, public_id };
    }
    if (Object.keys(updateFields).length === 0) {
        return next(new AppError('No fields provided for update', 400));
    }
    await userModel.findByIdAndUpdate(req.user._id, updateFields, { new: true });

    return res.status(200).json({ message: "User information updated successfully" });
};




export const adminResetUserCredentials = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user)
        return next(new AppError('User not found', 404));

    if (email != user.email)
        return next(new AppError("Email does not match with user's email", 400));

    user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    await user.save();
    return res.status(200).json({ message: "User credentials updated successfully" });
}
export const changeEmailConfirm = async (req, res, next) => {
    const { id } = req.params;
    const { confirmEmailValue } = req.body;
    const user = await userModel.findByIdAndUpdate(id, { confirmEmail: confirmEmailValue });
    if (!user)
        return next(new AppError('User not found', 404));
    return res.status(200).json({ message: `User confirmEmail value updated to ${confirmEmailValue}` });

}