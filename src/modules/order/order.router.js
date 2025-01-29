import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./order.role.js";
const router = Router({ caseSensitive: true });


router.post('/', auth(endPoints.create), orderController.createOrder);


export default router;