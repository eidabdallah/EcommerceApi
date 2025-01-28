import { Router } from "express";
import * as subCategoriesController from "./subCategory.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./subcategory.role.js";
const router = Router({ caseSensitive: true, mergeParams: true });

router.post('/', auth(endPoints.create), fileUpload(fileMimeTypes.image).single('image'), subCategoriesController.createSubCategory);
router.get('/', auth(endPoints.getAll), subCategoriesController.getAllSubCategoriesByCategory);
router.get('/active', auth(endPoints.getAllActive), subCategoriesController.getAllSubCategoriesActiveByCategory);
router.get('/:id', auth(endPoints.getById), subCategoriesController.getSubCategoryById);
router.patch('/:id', auth(endPoints.update), fileUpload(fileMimeTypes.image).single('image'), subCategoriesController.updateSubCategory);
router.delete('/:id', auth(endPoints.delete), subCategoriesController.deleteSubCategory);



export default router;