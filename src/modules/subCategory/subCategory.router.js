import { Router } from "express";
import * as subCategoriesController from "./subCategory.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
const router = Router({ caseSensitive: true , mergeParams: true });

router.post('/', auth() , fileUpload(fileMimeTypes.image).single('image'), subCategoriesController.createSubCategory);
router.get('/', subCategoriesController.getAllSubCategoriesByCategory);
router.get('/active', subCategoriesController.getAllSubCategoriesActiveByCategory);
router.get('/:id', subCategoriesController.getSubCategoryById);
router.patch('/:id', auth() , fileUpload(fileMimeTypes.image).single('image'), subCategoriesController.updateSubCategory);
router.delete('/:id',auth(), subCategoriesController.deleteSubCategory);



export default router;