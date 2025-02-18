import { Router } from "express";
import * as subCategoriesController from "./subCategory.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./subcategory.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as schema from "./subcategory.validation.js";
const router = Router({ caseSensitive: true, mergeParams: true });

router.post('/', fileUpload(fileMimeTypes.image).single('image') ,validation(schema.createSubCategorySchema), asyncHandler(auth(endPoints.create)),  asyncHandler(subCategoriesController.createSubCategory));
router.get('/', validation(schema.getAllSubCategoriesByCategorySchema),asyncHandler(auth(endPoints.getAll)), asyncHandler(subCategoriesController.getAllSubCategoriesByCategory));
router.get('/active',validation(schema.getAllSubCategoriesActiveByCategorySchema) ,asyncHandler(auth(endPoints.getAllActive)), asyncHandler(subCategoriesController.getAllSubCategoriesActiveByCategory));
router.get('/:id', validation(schema.getSubCategoryByIdSchema) , asyncHandler(auth(endPoints.getById)), asyncHandler(subCategoriesController.getSubCategoryById));
router.patch('/:id', fileUpload(fileMimeTypes.image).single('image'), validation(schema.updateSubCategorySchema) , asyncHandler(auth(endPoints.update)), asyncHandler(subCategoriesController.updateSubCategory));
router.delete('/:id', validation(schema.deleteSubCategorySchema) ,asyncHandler(auth(endPoints.delete)), asyncHandler(subCategoriesController.deleteSubCategory));



export default router;