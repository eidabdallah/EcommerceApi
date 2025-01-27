import bcrypt from 'bcryptjs';
import userModel from './../../../DB/model/user.model.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail.js';
export const register = async (req, res) => {
    const { userName, email, password, confirmPassword, age, gender } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(409).json({ message: "email already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const newUser = await userModel.create({ userName, email, password: hashedPassword, age, gender, confirmPassword });
    if (!newUser) {
        return res.status(201).json({ message: "error while creating user" });
    }
    const token = jwt.sign({ email }, process.env.SIGNTURESTOKEN , {expiresIn : 60*5}); // 5 min
    const refreshToken = jwt.sign({email} , process.env.SIGNTURESTOKEN , {expiresIn :60*60*24}); // 60*60 ==> 1h * 24 => 1day
    const html = `<h1>Welcome ${userName}!</h1>
    <p>Thank you for registering. Your account has been created.</p>
    <div>
        <a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>confirm Email</a>
        <a href='${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}'>resend Confirm email</a>
    </div>`;
    await sendEmail(email, 'Welcome Message', html);
    return res.json({ message: "success", user: newUser });
};
export const Login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('userName password confirmEmail');
    if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    if(!user.confirmEmail){
        return res.status(403).json({ message: "plz confim youe email" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SIGNTURESTOKEN);
    return res.json({ message: "success", token });
};
export const confirmEmail = async (req, res) => {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.SIGNTURESTOKEN);
    const user = await userModel.updateOne({email:decodedToken.email} , {confirmEmail:true});
    if(user.modifiedCount > 0) {
        return res.redirect("https://www.facebook.com");
    }
}