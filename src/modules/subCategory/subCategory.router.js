import { Router } from "express";
import * as subCategoriesController from "./subCategory.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./subcategory.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true, mergeParams: true });

router.post('/', asyncHandler(auth(endPoints.create)), fileUpload(fileMimeTypes.image).single('image'), asyncHandler(subCategoriesController.createSubCategory));
router.get('/', asyncHandler(auth(endPoints.getAll)), asyncHandler(subCategoriesController.getAllSubCategoriesByCategory));
router.get('/active', asyncHandler(auth(endPoints.getAllActive)), asyncHandler(subCategoriesController.getAllSubCategoriesActiveByCategory));
router.get('/:id', asyncHandler(auth(endPoints.getById)), asyncHandler(subCategoriesController.getSubCategoryById));
router.patch('/:id', asyncHandler(auth(endPoints.update)), fileUpload(fileMimeTypes.image).single('image'), asyncHandler(subCategoriesController.updateSubCategory));
router.delete('/:id', asyncHandler(auth(endPoints.delete)), asyncHandler(subCategoriesController.deleteSubCategory));



export default router;