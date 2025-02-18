import Joi from "joi";

import { generalFields } from './../../middleware/validation.middleware.js';

export const createSubCategorySchema = Joi.object({
    categoryId : generalFields.id,
    name: generalFields.categoryName,
    image : generalFields.image,
});

export const getAllSubCategoriesByCategorySchema = Joi.object({
    id : generalFields.id,
});
export const getAllSubCategoriesActiveByCategorySchema = Joi.object({
    id : generalFields.id,
});

export const getSubCategoryByIdSchema = Joi.object({
    id : generalFields.id,
});

export const updateSubCategorySchema = Joi.object({
    id : generalFields.id,
    name: generalFields.categoryName.optional(),
    status: Joi.string().valid("Active", "NotActive").messages({
        "any.only": "Status must be either 'Active' or 'NotActive'."
    }),
    image : generalFields.image.optional(),
 
});
export const deleteSubCategorySchema = Joi.object({
    id : generalFields.id,
});

