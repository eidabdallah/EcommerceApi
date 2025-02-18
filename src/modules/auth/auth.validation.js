import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const registerSchema = Joi.object({
    userName: Joi.string().pattern(/^[A-Za-z\s]+$/).min(3).max(30).required().messages({
        "string.pattern.base": "Username must contain only letters and spaces (A-Z, a-z).",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username must not exceed 30 characters.",
        "any.required": "Username field is required.",
    }),
    email : generalFields.email,
    password : generalFields.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.only": "Confirm password must match the password.",
        "any.required": "Confirm password field is required.",
    }),
    phoneNumber: Joi.string().pattern(/^\d{10}$/).required().messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
        "any.required": "Phone number field is required.",
    }),
    address: Joi.string().required().messages({
        "string.required": "Address field is required.",
    }),
});

export const loginSchema = Joi.object({
    email : generalFields.email,
    password : generalFields.password,
});

export const sendCodeSchema = Joi.object({
    email : generalFields.email,
});

export const forgetPasswordSchema = Joi.object({
    email : generalFields.email,
    password : generalFields.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.only": "Confirm password must match the password.",
        "any.required": "Confirm password field is required.",
    }),
    code: Joi.string().required().messages({
        "string.required": "Code field is required.",
    }),
});

export const changePasswordSchema = Joi.object({
    email : generalFields.email,
    oldPassword : generalFields.password,
    newPassword : generalFields.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        "any.only": "Confirm password must match the new password.",
        "any.required": "Confirm password field is required.",
    }),
});