import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { auth } from "../../middleware/auth.middleware.js";
import subcategoriesRouter from '../subCategory/subCategory.router.js';
import { endPoints } from "./category.role.js";
const router = Router({ caseSensitive: true });

router.use('/:id/subCategory' , subcategoriesRouter);
router.post('/', auth(endPoints.create) , fileUpload(fileMimeTypes.image).single('image'), categoriesController.createCategory);
router.get('/', auth(endPoints.getAll) , categoriesController.getAllCategories);
router.get('/active',auth(endPoints.getAllActive) , categoriesController.getAllCategoriesActive);
router.get('/:id', auth(endPoints.getById), categoriesController.getCategoryById);
router.patch('/:id', auth(endPoints.update) , fileUpload(fileMimeTypes.image).single('image'), categoriesController.updateCategory);
router.delete('/:id',auth(endPoints.delete), categoriesController.deleteCategory);



export default router;