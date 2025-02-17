import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./order.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true });


router.post('/', asyncHandler(auth(endPoints.create)), asyncHandler(orderController.createOrder));
router.get('/allOrder', asyncHandler(auth(endPoints.getAllOrder)), asyncHandler(orderController.getAllOrder));
router.get('/userOrders', asyncHandler(auth(endPoints.getOrderForUser)), asyncHandler(orderController.getAllOrderForUser));
router.patch('/changeStatus/:orderId',asyncHandler( auth(endPoints.changeStatus)) , asyncHandler(orderController.changeStatusOrder));



export default router;