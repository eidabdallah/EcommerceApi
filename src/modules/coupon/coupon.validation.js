import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const createCouponSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.min": "Coupon name must be at least 3 characters long.",
        "any.required": "Coupon name is required."
    }),
    amount: Joi.number().integer().min(1).max(100).required().messages({
        "number.min": "Coupon amount must be at least 1.",
        "number.max": "Coupon amount must not exceed 100.",
        "any.required": "Coupon amount is required."
    }),
    expireDate: Joi.date().greater('now').required().messages({
        "date.greater": "Coupon expiration date must be in the future.",
        "any.required": "Coupon expiration date is required."
    }),
});

export const updateCouponSchema = Joi.object({
    id: generalFields.id,
    amount: Joi.number().integer().min(1).max(100).required().messages({
        "number.min": "Coupon amount must be at least 1.",
        "number.max": "Coupon amount must not exceed 100.",
        "any.required": "Coupon amount is required."
    }),
    expireDate: Joi.date().greater('now').required().messages({
        "date.greater": "Coupon expiration date must be in the future.",
        "any.required": "Coupon expiration date is required."
    }),
});

export const deleteCouponSchema = Joi.object({
    id: generalFields.id,
});

export const getCouponsByIdSchema = Joi.object({
    id: generalFields.id,
});