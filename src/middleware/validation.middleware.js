
import Joi from 'joi';
export const generalFields = {
    id: Joi.string().hex().length(24).required().messages({
        "string.hex": "ID must be a hexadecimal string.",
        "string.length": "ID must be exactly 24 characters long.",
        "any.required": "ID field is required.",
    }),
    email: Joi.string().email().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required().messages({
        "string.email": "Please enter a valid email address.",
        "string.pattern.base": "Email must have a .com or .net domain only.",
        "any.required": "Email field is required.",
    }),
    password: Joi.string().min(8).max(32).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/).required().messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must not exceed 32 characters.",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "any.required": "Password field is required.",
    }),
}
export const validation = (Schema) => {
    return (req, res, next) => {
        let fillterData = { ...req.body, ...req.params, ...req.query };
        if(req.file)
            fillterData.image = req.file;
        const errorMessages = {};
        const { error } = Schema.validate(fillterData, { abortEarly: false });
        if (error) {
            error.details.forEach((err) => {
                const key = err.context.key;
                errorMessages[key] = err.message;
            });
            return res.status(400).json({ message: "validation Error", error: errorMessages });
        }
        next();
    };
}  