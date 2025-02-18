import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createCartSchema = Joi.object({
    productId: generalFields.id,
});

export const deleteProductFromCartSchema = Joi.object({
    productId: generalFields.id,
});

export const updateProductQuantitySchema = Joi.object({
    productId: generalFields.id,
    quantity: Joi.number().integer().positive().required().messages({
        "number.base": "Quantity must be a number.",
        "number.integer": "Quantity must be an integer.",
        "number.positive": "Quantity must be a positive number.",
        "any.required": "Quantity is required.",
    }),
    operator: Joi.string().valid("+", "-").required().messages({
        "string.base": "Operator must be a string.",
        "any.only": "Operator must be either '+' or '-'.",
        "any.required": "Operator is required.",
    }),
});
