import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./review.role.js";
import { fileMimeTypes, fileUpload } from './../../utils/multer.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as schema from "./review.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router({ caseSensitive: true , mergeParams: true});

router.post('/' , fileUpload(fileMimeTypes.image).single('image'), validation(schema.createReviewSchema) , asyncHandler(auth(endPoints.create)) , asyncHandler(reviewController.createReview));

export default router;