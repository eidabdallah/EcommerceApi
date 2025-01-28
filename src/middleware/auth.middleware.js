import  jwt  from 'jsonwebtoken';
import userModel from './../../DB/model/user.model.js';
export const auth = () => {
    return async(req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await userModel.findById(decode.id).select('userName');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
}