import jwt from 'jsonwebtoken';
import userModel from './../../DB/model/user.model.js';
import { AppError } from './../utils/AppError.js';

export const roles = {
    ADMIN: 'Admin',
    USER: 'User'
};
export const auth = (accessRoles = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERKEY)) {
            return next(new AppError("Invalid token", 401));
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return next(new AppError("Invalid token", 401));
        }
        const user = await userModel.findById(decode.id).select('userName role email');
        if (!user) {
            return next(new AppError("User not found", 404));
        }
        if (!accessRoles.includes(user.role)) {
            return next(new AppError("Unauthorized access", 403));
        }

        req.user = user;
        next();
    }
}