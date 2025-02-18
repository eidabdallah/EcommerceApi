import Joi from "joi";

import { generalFields } from './../../middleware/validation.middleware.js';

export const createProductSchema = Joi.object({
    categoryId : generalFields.id,
    subcategoryId : generalFields.id,
    name: generalFields.categoryName,
    image : generalFields.image,
    discount: Joi.number().min(0).max(100).messages({
        "number.min": "Discount cannot be less than 0%.",
        "number.max": "Discount cannot exceed 100%."
    }),
    description: Joi.string().min(10).max(1000).required().messages({
        "string.min": "Description must be at least 10 characters long.",
        "string.max": "Description must not exceed 1000 characters.",
        "any.required": "Product description is required."
    }),
    stock: Joi.number().integer().min(0).required().messages({
        "number.min": "Stock cannot be negative.",
        "any.required": "Stock quantity is required."
    }),
});

export const getProductByIdSchema = Joi.object({
    id : generalFields.id,
});
export const getAllProductsSchema = Joi.object({
    id : generalFields.id,
});

