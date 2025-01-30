import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
const router = Router({ caseSensitive: true });

router.post('/', auth(endPoints.create), couponController.createCoupon);
router.get('/', auth(endPoints.getAll), couponController.getAllCoupons);
router.patch('/:id' , auth(endPoints.update), couponController.updateCoupon);
router.get('/:id' , auth(endPoints.getById) , couponController.getCouponById);
router.delete('/:id' , auth(endPoints.delete) , couponController.deleteCoupon);


export default router;