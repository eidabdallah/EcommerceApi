import Joi from "joi";

import { generalFields } from './../../middleware/validation.middleware.js';

export const createCategorySchema = Joi.object({
    name: Joi.string().min(5).max(50).required().messages({
        "string.empty": "Category name is required.",
        "string.min": "Category name must be at least 3 characters long.",
        "string.max": "Category name must not exceed 50 characters.",
        "any.required": "Category name is required."
    }),
    image : generalFields.image,
});

export const getCategoryByIdSchema = Joi.object({
    id : generalFields.id,
});

export const deleteCategorySchema = Joi.object({
    id : generalFields.id,
});


export const updateCategorySchema = Joi.object({
    id : generalFields.id,
    name: Joi.string().min(3).max(50).messages({
        "string.min": "Category name must be at least 3 characters long.",
        "string.max": "Category name must not exceed 50 characters.",
    }),
    status: Joi.string().valid("Active", "NotActive").messages({
        "any.only": "Status must be either 'Active' or 'NotActive'."
    }),
    image : generalFields.image.optional(),

});
