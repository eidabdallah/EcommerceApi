import Joi from 'joi';
import { generalFields } from '../../middleware/validation.middleware.js';
export const registerSchema = {
    body: Joi.object({
        userName: Joi.string().alphanum().min(3).max(20).required().messages({
            "string.empty": "userName is required.",
            "any.required": "userName is required.",
            "string.min": "userName should have at least 3 characters.",
            "string.max": "userName should have at most 20 characters.",
            "string.alphanum": "userName should only contain alphanumeric characters.",
        }),
        email: generalFields.email,
        password: generalFields.password,
        confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
            "any.only": "Confirm password must match the password.",
            "any.required": "Confirm password is required.",
        }),
        age: Joi.number().min(10).positive().integer().required().messages({
            "number.base": "Age must be a number.",
            "number.empty": "Age is required.",
            "any.required": "Age is required.",
            "number.min": "Age must be at least 10.",
            "number.positive": "Age must be a positive number.",
            "number.integer": "Age must be an integer.",
        }),
        gender: Joi.string().valid('Male', 'Female').required().messages({
            "any.only": "Gender must be either 'Male' or 'Female'.",
            "string.empty": "Gender is required.",
            "any.required": "Gender is required.",
        }),
    }),
};

export const loginSchema = {
    body: Joi.object({
        email: generalFields.email,
        password: generalFields.password,
    })
};

