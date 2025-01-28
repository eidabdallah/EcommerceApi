import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
const router = Router({ caseSensitive: true });

router.post('/', fileUpload(fileMimeTypes.image).single('image'), categoriesController.createCategory);
router.get('/', categoriesController.getAllCategories);
router.get('/active', categoriesController.getAllCategoriesActive);
router.get('/:id', categoriesController.getCategoryById);
router.patch('/:id', fileUpload(fileMimeTypes.image).single('image'), categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);



export default router;