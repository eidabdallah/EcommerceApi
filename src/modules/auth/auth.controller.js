import userModel from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    res.status(201).json({ message: 'User registered successfully', user: createUser });
}
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
        return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Logged in successfully', token });
}
