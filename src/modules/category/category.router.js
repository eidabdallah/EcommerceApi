import { Router } from "express";
import * as categoriesController from "./category.controller.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
const router = Router({ caseSensitive: true });

router.post('/', fileUpload(fileMimeTypes.image).single('image'), categoriesController.createCategory);

export default router;