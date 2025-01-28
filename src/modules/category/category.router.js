import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import subcategoriesRouter from '../subCategory/subCategory.router.js';
const router = Router({ caseSensitive: true });

router.use('/:id/subCategory' , subcategoriesRouter);
router.post('/', auth() , fileUpload(fileMimeTypes.image).single('image'), categoriesController.createCategory);
router.get('/', categoriesController.getAllCategories);
router.get('/active', categoriesController.getAllCategoriesActive);
router.get('/:id', categoriesController.getCategoryById);
router.patch('/:id', auth() , fileUpload(fileMimeTypes.image).single('image'), categoriesController.updateCategory);
router.delete('/:id',auth(), categoriesController.deleteCategory);



export default router;