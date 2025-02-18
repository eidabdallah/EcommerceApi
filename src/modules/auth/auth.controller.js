import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from "nanoid";
import { confirmEmailMessage, sendCodeToEmail, sendConfirmEmail } from "../../utils/authTemplete.js";
import { AppError } from "../../utils/AppError.js";

export const register = async (req, res, next) => {
  const { userName, email, password, phoneNumber, address } = req.body;
  const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  const createUser = await userModel.create({ userName, email, password: hashPassword, phoneNumber, address });
  await sendConfirmEmail(email, userName, req);
  return res.status(201).json({ message: 'User registered successfully', user: createUser });
}
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError('Invalid credentials', 400));
  if (!user.confirmEmail) return next(new AppError('Please confirm your email', 403));

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return next(new AppError('Invalid credentials', 400));
  if (user.status === 'NotActive') return next(new AppError('Your Account is Blocked', 400));
  const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: '10h' });
  return res.status(200).json({ message: 'Logged in successfully', token });
}
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError("Token is required", 400));
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOneAndUpdate(
    { email: decodedToken.email },
    { confirmEmail: true },
    { new: true }
  );
  if (user) {
    await confirmEmailMessage(user.userName, res);
  }
}

export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError('Email not found', 404));
  const code = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 6)();
  user.sendCode = code;
  await user.save();
  await sendCodeToEmail(email, code);
  setTimeout(async () => {
    user.sendCode = null;
    await user.save();
  }, 5 * 60 * 1000);
  return res.status(200).json({ message: 'Code sent successfully' });
}

export const forgetPassword = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError('Email not found', 404));
  if (user.sendCode !== code) return next(new AppError('Invalid code', 403));
  user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  user.sendCode = null;
  await user.save();
  return res.status(200).json({ message: 'Password reset successfully' });
}

export const changePassword = async (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  if (req.user.email !== email) return next(new AppError('The email address provided does not match your account.', 403));
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError('Email not found', 404));
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) return next(new AppError('Invalid old password', 403));
  user.password = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
  await user.save();
  return res.status(200).json({ message: 'Password changed successfully' });
}
