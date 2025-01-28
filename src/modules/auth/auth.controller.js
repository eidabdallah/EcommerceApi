import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
    const { userName, email, password, phoneNumber, address } = req.body;
    const user = await userModel.findOne({ email });
    if (user)
        return res.status(409).json({ message: 'User already exists' });

    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const createUser = await userModel.create({ userName , email , password: hashPassword , phoneNumber , address});
    res.status(201).json({ message: 'User registered successfully', user: createUser });
}
export const login = async (req, res, next) => {

}
export const logout = async (req, res, next) => {

}