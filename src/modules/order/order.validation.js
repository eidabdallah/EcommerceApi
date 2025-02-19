import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const createOrderSchema = Joi.object({
    couponName: Joi.string().min(3).messages({
        "string.min": "Coupon name must be at least 3 characters long.",
    }),
    phoneNumber: Joi.string().pattern(/^\d{10}$/).messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
    address: Joi.string().min(2).messages({
        "string.min": "Address must be at least 2 characters long.",
    }),
});


export const changeStatusOrderSchema = Joi.object({
    orderId: generalFields.id,
    newStatus: Joi.string().valid("pending", "cancelled", "confirmed", "onway", "delivered").required().messages({
        "any.only": "Status must be either 'pending', 'cancelled', 'confirmed', 'onway', or 'delivered'.",
        "any.required": "Status is required."
    })
});