import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
const router = Router({ caseSensitive: true });

// نعمل فالديشن انه ما يدخل تاريخ قديم  
router.post('/', auth(endPoints.create), couponController.createCoupon);


export default router;