import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import subcategoriesRouter from '../subCategory/subCategory.router.js';
import { endPoints } from "./category.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
const router = Router({ caseSensitive: true });

router.use('/:id/subCategory' , subcategoriesRouter);
router.post('/', asyncHandler(auth(endPoints.create)) , fileUpload(fileMimeTypes.image).single('image'), asyncHandler(categoriesController.createCategory));
router.get('/', asyncHandler(auth(endPoints.getAll)) , asyncHandler(categoriesController.getAllCategories));
router.get('/active',asyncHandler(auth(endPoints.getAllActive)) , asyncHandler(categoriesController.getAllCategoriesActive));
router.get('/:id', asyncHandler(auth(endPoints.getById)), asyncHandler(categoriesController.getCategoryById));
router.patch('/:id', asyncHandler(auth(endPoints.update)) , fileUpload(fileMimeTypes.image).single('image'), asyncHandler(categoriesController.updateCategory));
router.delete('/:id',asyncHandler(auth(endPoints.delete)), asyncHandler(categoriesController.deleteCategory));



export default router;