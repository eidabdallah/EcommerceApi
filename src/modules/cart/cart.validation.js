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
    quantity: Joi.number().integer().positive().required(),
    operator: Joi.string().valid("+", "-").required(),
});
