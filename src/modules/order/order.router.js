import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./order.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true });
import * as schema from "./order.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

router.post('/', validation(schema.createOrderSchema) ,asyncHandler(auth(endPoints.create)), asyncHandler(orderController.createOrder));
router.get('/allOrder', asyncHandler(auth(endPoints.getAllOrder)), asyncHandler(orderController.getAllOrder));
router.get('/userOrders', asyncHandler(auth(endPoints.getOrderForUser)), asyncHandler(orderController.getAllOrderForUser));
router.patch('/changeStatus/:orderId', validation(schema.changeStatusOrderSchema) , asyncHandler( auth(endPoints.changeStatus)) , asyncHandler(orderController.changeStatusOrder));



export default router;