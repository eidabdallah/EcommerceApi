import Joi from "joi";
import { generalFields } from './../../middleware/validation.middleware.js';

export const deleteUserSchema = Joi.object({
    id: generalFields.id,
});
export const updateUserStatusSchema = Joi.object({
    id: generalFields.id,
    status: Joi.string().valid("Active", "NotActive").messages({
        "any.only": "Status must be either 'Active' or 'NotActive'."
    }),
});
export const updateUserInformationSchema = Joi.object({
    userName: Joi.string().pattern(/^[A-Za-z\s]+$/).min(3).max(30).messages({
        "string.pattern.base": "Username must contain only letters and spaces (A-Z, a-z).",
        "string.min": "Username must be at least 3 characters long.",
        "string.max": "Username must not exceed 30 characters.",
        "any.required": "Username field is required.",
    }),
    phoneNumber: Joi.string().pattern(/^\d{10}$/).messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
        "any.required": "Phone number field is required.",
    }),
    address: Joi.string().min(2).messages({
        "string.required": "Address field is required.",
        "string.min": "Address must be at least 2 characters long.",
    }),
    image: generalFields.image.optional(),
});

export const changeEmailConfirmSchema = Joi.object({
    confirmEmailValue: Joi.boolean().required().messages({
        'boolean.base': 'confirmEmailValue must be a boolean (true or false).',
        'any.required': 'confirmEmailValue is required.'
    })
});


export const adminResetUserCredentialsSchema = Joi.object({
    email: generalFields.email,
    password: generalFields.password,
});

