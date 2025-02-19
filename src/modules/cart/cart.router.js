import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./cart.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
import { validation } from "../../middleware/validation.middleware.js";
import * as schema from "./cart.validation.js";
const router = Router({ caseSensitive: true });

router.get('/', asyncHandler(auth(endPoints.getCart)), asyncHandler(cartController.getCart));
router.post('/', validation(schema.createCartSchema), asyncHandler(auth(endPoints.create)), asyncHandler(cartController.createCart));
router.patch('/clear', asyncHandler(auth(endPoints.clear)), asyncHandler(cartController.clearCart));
router.patch('/:productId',  validation(schema.deleteProductFromCartSchema) ,asyncHandler(auth(endPoints.delete)), asyncHandler(cartController.deleteProductFromCart));
router.patch('/updateQuantity/:productId',  validation(schema.updateProductQuantitySchema) ,asyncHandler(auth(endPoints.updateProductQuantity)), asyncHandler(cartController.updateProductQuantity));

export default router;