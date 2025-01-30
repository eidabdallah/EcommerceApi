import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./order.role.js";
const router = Router({ caseSensitive: true });


router.post('/', auth(endPoints.create), orderController.createOrder);
router.get('/allOrder', auth(endPoints.getAllOrder), orderController.getAllOrder);
router.get('/userOrders', auth(endPoints.getOrderForUser), orderController.getAllOrderForUser);
router.patch('/changeStatus/:orderId', auth(endPoints.changeStatus) , orderController.changeStatusOrder);



export default router;