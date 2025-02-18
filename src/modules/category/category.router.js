import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import subcategoriesRouter from '../subCategory/subCategory.router.js';
import { endPoints } from "./category.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as schema from "./category.validation.js";
const router = Router({ caseSensitive: true });

router.use('/:id/subCategory', subcategoriesRouter);
router.post('/', fileUpload(fileMimeTypes.image).single('image'), validation(schema.createCategorySchema), asyncHandler(auth(endPoints.create)), asyncHandler(categoriesController.createCategory));
router.get('/', asyncHandler(auth(endPoints.getAll)), asyncHandler(categoriesController.getAllCategories));
router.get('/active', asyncHandler(auth(endPoints.getAllActive)), asyncHandler(categoriesController.getAllCategoriesActive));
router.get('/:id', validation(schema.getCategoryByIdSchema), asyncHandler(auth(endPoints.getById)), asyncHandler(categoriesController.getCategoryById));
router.patch('/:id', fileUpload(fileMimeTypes.image).single('image'), validation(schema.updateCategorySchema), asyncHandler(auth(endPoints.update)), asyncHandler(categoriesController.updateCategory));
router.delete('/:id', validation(schema.deleteCategorySchema), asyncHandler(auth(endPoints.delete)), asyncHandler(categoriesController.deleteCategory));



export default router;