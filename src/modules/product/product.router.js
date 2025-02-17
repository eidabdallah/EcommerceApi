import { Router } from "express";
import * as productController from "./product.controller.js";
import { fileMimeTypes, fileUpload } from './../../utils/multer.js';
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./product.role.js";
import reviewRouter from './../review/review.router.js';
const router = Router({ caseSensitive: true });

router.use('/:productId/review' , reviewRouter);
router.post('/', auth(endPoints.create), fileUpload(fileMimeTypes.image).fields([
    {name:'mainImage' , maxCount : 1}, {name:'subImages', maxCount: 5}])
    , productController.createProduct);
router.get('/' ,  productController.getAllProducts);
router.get('/:id' ,  productController.getProductById);


export default router;