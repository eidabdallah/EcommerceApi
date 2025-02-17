import userModel from "../../DB/model/user.model.js";

export const checkEmailAndPhoneExist = async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  const checkEmail = await userModel.findOne({ email });
  if (checkEmail)
    return res.status(409).json({ message: 'Email already exists' });

  const checkPhone = await userModel.findOne({ phoneNumber });
  if (checkPhone)
    return res.status(409).json({ message: 'Phone number already exists' });

  next();
}