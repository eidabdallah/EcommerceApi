import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const createReviewSchema = Joi.object({
    productId : generalFields.id,
    comment: Joi.string().min(3).required().messages({
        "string.min": "Comment must be at least 3 characters long.",
        "any.required": "Comment is required."
    }),
    rating: Joi.number().min(1).max(5).required().messages({
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating must not exceed 5.",
        "any.required": "Rating is required."
    }),
    image : generalFields.image.optional(),
});


