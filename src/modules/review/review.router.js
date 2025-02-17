import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./review.role.js";
import { fileMimeTypes, fileUpload } from './../../utils/multer.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true , mergeParams: true});

router.post('/' , asyncHandler(auth(endPoints.create)) ,fileUpload(fileMimeTypes.image).single('image'), asyncHandler(reviewController.createReview));

export default router;