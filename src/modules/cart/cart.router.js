import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./cart.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
const router = Router({ caseSensitive: true });

router.get('/', asyncHandler(auth(endPoints.getCart)) , asyncHandler(cartController.getCart));
router.post('/', asyncHandler(auth(endPoints.create)), asyncHandler(cartController.createCart));
router.patch('/clear', asyncHandler(auth(endPoints.clear)) , asyncHandler(cartController.clearCart));
router.patch('/:productId', asyncHandler(auth(endPoints.delete)) , asyncHandler(cartController.deleteProductFromCart));
router.patch('/updateQuantity/:productId', asyncHandler(auth(endPoints.updateProductQuantity)) , asyncHandler(cartController.updateProductQuantity));

export default router;