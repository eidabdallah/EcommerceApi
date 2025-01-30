import userModel from "../../../DB/model/user.model.js";
import cloudinary from './../../utils/cloudinary.js';
import { sendConfirmEmail } from './../auth/authHelpers.js';
import cartModel from './../../../DB/model/cart.model.js';
import { bcrypt } from 'bcryptjs';

export const getAllUser = async (req, res, next) => {
    const users = await userModel.find({}).select("-password");
    if (users.length > 0)
        return res.status(200).json({ message: 'All users retrieved successfully', users });
    return res.status(404).json({ message: 'There are no users.' });
}

export const getUserInformation = async (req, res, next) => {
    const user = await userModel.findById(req.user._id).select("userName email phoneNumber address");
    if (!user)
        return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User retrieved successfully", user });
};

export const deleteUser = async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    await cartModel.deleteMany({ userId: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
};

export const updateUserStatus = async (req, res, next) => {
    const { status } = req.body;

    const user = await userModel.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });

    if (!["Active", "NotActive"].includes(status))
        return res.status(400).json({ message: "Invalid status value" });


    user.status = status;
    await user.save();
    return res.status(200).json({ message: `User status updated to ${status}` });
};

// check also 
export const updateUserInfromation = async (req, res, next) => {
    const { userName, email, phoneNumber, address, image } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user)
        return res.status(404).json({ message: "User not found" });

    if (userName) user.userName = userName;
    if (email) {
        if (email == req.user.email)
            return res.status(400).json({ message: "Email is already your current email" });

        const checkEmail = await userModel.findOne({ email });
        if (checkEmail)
            return res.status(400).json({ message: "Email already exists" });

        user.email = email;
        await sendConfirmEmail(email, (userName || req.user.userName), req);
    }
    if (phoneNumber) {
        if (phoneNumber == req.user.phoneNumber)
            return res.status(400).json({ message: "Phone number is already your current phone number" });
        const checkPhone = await userModel.findOne({ phoneNumber });
        if (checkPhone)
            return res.status(400).json({ message: "Phone number already exists" });
        user.phoneNumber = phoneNumber;
    }
    if (address) user.address = address;
    if (image) {
        if (user.image?.public_id)
            await cloudinary.uploader.destroy(user.image.public_id);
        const { secure_url, public_id } = await cloudinary.uploader.upload(image, { folder: "users" });
        user.image = { secure_url, public_id };
        user.save();
        return res.status(200).json({ message: "User information updated successfully", user });
    }
}

export const adminResetUserCredentials = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: "User not found" });

    if (email != user.email)
        return res.status(400).json({ message: "Email does not match with user's email" });
    
    await sendConfirmEmail(email, (user.userName || req.user.userName), req);

    user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    await user.save();
    return res.status(200).json({ message: "User credentials updated successfully" });
}