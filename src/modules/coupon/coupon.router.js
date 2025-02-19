import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./coupon.role.js";
import { asyncHandler } from './../../utils/asyncHandler.js';
import * as schema from "./coupon.validation.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router({ caseSensitive: true });
 
router.post('/', validation(schema.createCouponSchema) , asyncHandler(auth(endPoints.create)), asyncHandler(couponController.createCoupon));
router.get('/', asyncHandler(auth(endPoints.getAll)), asyncHandler(couponController.getAllCoupons));
router.patch('/:id' ,validation(schema.updateCouponSchema), asyncHandler(auth(endPoints.update)), asyncHandler(couponController.updateCoupon));
router.get('/:id' , validation(schema.getCouponsByIdSchema) , asyncHandler(auth(endPoints.getById)) , asyncHandler(couponController.getCouponById));
router.delete('/:id' , validation(schema.deleteCouponSchema), asyncHandler(auth(endPoints.delete)) , asyncHandler(couponController.deleteCoupon));


export default router;