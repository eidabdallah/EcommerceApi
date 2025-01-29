import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail.js";
import { customAlphabet } from "nanoid";

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

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 60 * 5 });
  const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const html = `
   <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: auto; background: linear-gradient(135deg, #007bff, #6c757d); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
      <div style="display: inline-block; border-radius: 50%; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <img src="https://res.cloudinary.com/deylqxzgk/image/upload/v1738093063/logo_h7fcb2.png" 
             alt="${process.env.APPNAME} Logo" 
             style="width: 250px; display: block; margin: auto;" />
      </div>
      <h1 style="color: white; font-size: 28px; margin-top: 20px;">Welcome, ${userName}!</h1>
    </div>
    <p style="font-size: 16px; color: #f8f9fa; line-height: 1.5;">
      Thank you for joining <b>${process.env.APPNAME}</b>! We're excited to have you onboard.
    </p>
    <p style="font-size: 16px; color: #f8f9fa; line-height: 1.5;">
      Please confirm your email to activate your account and enjoy our services.
    </p>
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}" 
       style="display: inline-block; margin: 20px 0; padding: 12px 25px; font-size: 16px; color: white; background-color: #ffc107; text-decoration: none; border-radius: 5px;">
       Confirm Email
    </a>
    <p style="font-size: 14px; color: #f8f9fa; margin: 20px 0;">
      Didn’t receive the email? Click the link below to resend it:
    </p>
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${refreshToken}" 
       style="display: inline-block; padding: 10px 20px; font-size: 14px; color: #ffc107; text-decoration: none; border-radius: 5px; border: 1px solid #ffc107;">
       Resend Confirmation Email
    </a>
    <p style="font-size: 12px; color: #dee2e6; margin-top: 20px; line-height: 1.5;">
      This email confirmation link is valid for 5 minutes. If you did not request this, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #6c757d; margin: 20px 0;" />
  </div>
</div>
`;
  await sendEmail(email, 'Confirm Email', html);
  res.status(201).json({ message: 'User registered successfully', user: createUser });
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
  const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
  const html = `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: linear-gradient(135deg, #007bff, #6c757d); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
        <div style="display: inline-block; border-radius: 50%; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <img src="https://res.cloudinary.com/deylqxzgk/image/upload/v1738093063/logo_h7fcb2.png" 
               alt="App Logo" 
               style="width: 100px; display: block; margin: auto;" />
        </div>
        <h1 style="color: white; font-size: 28px; margin-top: 20px;">Your Verification Code</h1>
      </div>
      <p style="font-size: 16px; color: #f8f9fa; line-height: 1.5; margin: 20px 0;">
        Here is your code to reset your password. This code will expire in <strong>5 minutes</strong>.
      </p>
      <div style="background-color: #fff; padding: 15px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin: 20px auto;">
        <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${code}</p>
      </div>
      <p style="font-size: 14px; color: #f8f9fa; margin: 20px 0;">
        Please enter this code in the reset password page to proceed.
      </p>
      <p style="font-size: 12px; color: #dee2e6; margin-top: 20px; line-height: 1.5;">
        If you did not request a password reset, please ignore this email. This code will expire automatically.
      </p>
      <hr style="border: none; border-top: 1px solid #6c757d; margin: 20px 0;" />
    </div>
  </div>`;
  await sendEmail(email, 'Reset Password', html);
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
  res.status(200).json({ message: 'Password reset successfully' });
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
  res.status(200).json({ message: 'Password changed successfully' });
}