import { Router } from "express";
import * as productController from "./product.controller.js";
import { fileMimeTypes, fileUpload } from './../../utils/multer.js';
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./product.role.js";
import reviewRouter from './../review/review.router.js';
import { asyncHandler } from './../../utils/asyncHandler.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as schema from "./product.validation.js";
const router = Router({ caseSensitive: true });

router.use('/:productId/review', reviewRouter);
router.post('/', fileUpload(fileMimeTypes.image).fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 5 }]),
    validation(schema.createProductSchema) , asyncHandler(auth(endPoints.create)), asyncHandler(productController.createProduct));
router.get('/', validation(schema.getAllProductsSchema) , asyncHandler(productController.getAllProducts));
router.get('/:id', validation(schema.getProductByIdSchema) , asyncHandler(productController.getProductById));


export default router;