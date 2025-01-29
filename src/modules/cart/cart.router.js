import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./cart.role.js";
const router = Router({ caseSensitive: true });

router.get('/', auth(endPoints.getCart) , cartController.getCart);
router.post('/', auth(endPoints.create), cartController.createCart);
router.patch('/clear', auth(endPoints.clear) , cartController.clearCart);
router.patch('/:productId', auth(endPoints.delete) , cartController.deleteProductFromCart);
router.patch('/updateQuantity/:productId', auth(endPoints.updateProductQuantity) , cartController.updateProductQuantity);

export default router;