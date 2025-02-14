import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { customAlphabet } from "nanoid";
import { sendCodeToEmail, sendConfirmEmail } from "./authHelpers.js";

export const register = async (req, res, next) => {
  const { userName, email, password, phoneNumber, address } = req.body;
  const user = await userModel.findOne({ email });
  if (user)
    return res.status(409).json({ message: 'User already exists' });
  const checkPhone = await userModel.findOne({ phoneNumber });
  if (checkPhone)
    return res.status(409).json({ message: 'Phone number already exists' });

  const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  const createUser = await userModel.create({ userName, email, password: hashPassword, phoneNumber, address });

  await sendConfirmEmail(email, userName, req);
  return res.status(201).json({ message: 'User registered successfully', user: createUser });
}
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.confirmEmail)
    return res.status(403).json({ message: 'Please confirm your email' });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials' });
  if (user.status == 'NotActive')
    return res.status(400).json({ message: 'Your Account is Blocked' });
  const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: '10h' });
  return res.status(200).json({ message: 'Logged in successfully', token });
}
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.updateOne({ email: decodedToken.email }, { confirmEmail: true });
  if (user.modifiedCount > 0) {
    return res.redirect("http://localhost:5173/auth");
  }
}

export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(404).json({ message: 'Email not found' });
  const code = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 6)();
  user.sendCode = code;
  await user.save();
  await sendCodeToEmail(email, code);
  setTimeout(async () => {
    user.sendCode = null;
    await user.save();
  }, 5 * 60 * 1000);
  res.status(200).json({ message: 'Code sent successfully' });
}

export const forgetPassword = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(404).json({ message: 'Email not found' });
  if (user.sendCode != code) {
    return res.status(403).json({ message: 'Invalid code' });
  }
  user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
  user.sendCode = null;
  await user.save();
  return res.status(200).json({ message: 'Password reset successfully' });
}

export const changePassword = async (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  if (req.user.email != email)
    return res.status(403).json({ message: 'The email address provided does not match your account.' });
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(404).json({ message: 'Email not found' });
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch)
    return res.status(403).json({ message: 'Invalid old password' });
  user.password = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
  await user.save();
  return res.status(200).json({ message: 'Password changed successfully' });
}
