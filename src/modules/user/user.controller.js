import userModel from "../../../DB/model/user.model.js";
import cartModel from './../../../DB/model/cart.model.js';
import bcrypt from 'bcryptjs';
import { AppError } from './../../utils/AppError.js';

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