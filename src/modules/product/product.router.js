import { Router } from "express";
import * as productController from "./product.controller.js";
import { fileMimeTypes, fileUpload } from './../../utils/multer.js';
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./product.role.js";
const router = Router({ caseSensitive: true });

router.post('/', auth(endPoints.create), fileUpload(fileMimeTypes.image).fields([
    {name:'mainImage' , maxCount : 1}, {name:'subImages', maxCount: 5}])
    , productController.createProduct);


export default router;