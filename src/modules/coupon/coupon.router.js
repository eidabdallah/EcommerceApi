import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
const router = Router({ caseSensitive: true });

router.post('/', asyncHandler(auth(endPoints.create)), asyncHandler(couponController.createCoupon));
router.get('/', asyncHandler(auth(endPoints.getAll)), asyncHandler(couponController.getAllCoupons));
router.patch('/:id' , asyncHandler(auth(endPoints.update)), asyncHandler(couponController.updateCoupon));
router.get('/:id' , asyncHandler(auth(endPoints.getById)) , asyncHandler(couponController.getCouponById));
router.delete('/:id' , asyncHandler(auth(endPoints.delete)) , asyncHandler(couponController.deleteCoupon));


export default router;