import Joi from "joi";

import { generalFields } from './../../middleware/validation.middleware.js';

export const createProductSchema = Joi.object({
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    name: generalFields.categoryName,
    discount: Joi.number().min(0).max(100).messages({
        "number.min": "Discount cannot be less than 0%.",
        "number.max": "Discount cannot exceed 100%."
    }),
    description: Joi.string().min(10).max(1000).required().messages({
        "string.min": "Description must be at least 10 characters long.",
        "string.max": "Description must not exceed 1000 characters.",
        "any.required": "Product description is required."
    }),
    stock: Joi.number().integer().min(0).default(1).messages({
        "number.min": "Stock cannot be negative.",
    }),
    price: Joi.number().min(1).required().messages({
        "number.min": "Price cannot be less than 1.",
        "any.required": "Price is required."
    }),
    sizes: Joi.array().items(Joi.string().valid('Small', 'Medium', 'Large', 'xlarge', 'xxlarge')).min(1).max(5).messages({
        "array.min": "At least one size must be selected.",
        "array.max": "No more than 5 sizes are allowed.",
        "array.items": "All sizes must be valid."
    }),
    mainImage: Joi.array().items(generalFields.image),
    subImages: Joi.array().items(generalFields.image).max(5).optional(),
});

export const getProductByIdSchema = Joi.object({
    id: generalFields.id,
});
export const getAllProductsSchema = Joi.object({
    page: Joi.number().min(1).optional().messages({
        "number.base": "Page must be a number.",
        "number.min": "Page must be at least 1."
    }),
    limit: Joi.number().min(1).optional().messages({
        "number.base": "Limit must be a number.",
        "number.min": "Limit must be at least 1.",
    }),
    sort: Joi.string().optional().messages({
        "string.base": "Sort must be a string."
    }),
    search: Joi.string().optional().messages({
        "string.base": "Search query must be a string."
    }),
    fields: Joi.string().optional().messages({
        "string.base": "Fields must be a string."
    }),
}).unknown(true);

export const deleteProductSchema = Joi.object({
    id: generalFields.id,
});

export const updateProductSchema = Joi.object({
    id: generalFields.id.required(),
    categoryId: generalFields.id.optional(),
    subcategoryId: generalFields.id.optional(),
    name: generalFields.categoryName.optional(),
    discount: Joi.number().min(0).max(100).optional().messages({
        "number.min": "Discount cannot be less than 0%.",
        "number.max": "Discount cannot exceed 100%."
    }),
    description: Joi.string().min(10).max(1000).optional().messages({
        "string.min": "Description must be at least 10 characters long.",
        "string.max": "Description must not exceed 1000 characters."
    }),
    stock: Joi.number().integer().min(0).optional().messages({
        "number.min": "Stock cannot be negative.",
    }),
    price: Joi.number().min(1).optional().messages({
        "number.min": "Price cannot be less than 1."
    }),
    sizes: Joi.array().items(Joi.string().valid('Small', 'Medium', 'Large', 'xlarge', 'xxlarge')).min(1).max(5).optional().messages({
        "array.min": "At least one size must be selected.",
        "array.max": "No more than 5 sizes are allowed."
    }),
    mainImage: Joi.array().items(generalFields.image).optional(),
    subImages: Joi.array().items(generalFields.image).max(5).optional(),
}).unknown(true);

export const getProductsByCategorySubcategoriesSchema = Joi.object({
    categoryId: generalFields.id,
    page: Joi.number().min(1).optional().messages({
        "number.base": "Page must be a number.",
        "number.min": "Page must be at least 1."
    }),
    limit: Joi.number().min(1).optional().messages({
        "number.base": "Limit must be a number.",
        "number.min": "Limit must be at least 1.",
    }),
    sort: Joi.string().optional().messages({
        "string.base": "Sort must be a string."
    }),
    search: Joi.string().optional().messages({
        "string.base": "Search query must be a string."
    }),
    fields: Joi.string().optional().messages({
        "string.base": "Fields must be a string."
    }),
});