import { Router } from "express";
import * as authController from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./auth.role.js";
import { checkEmailAndPhoneExist } from "../../middleware/checkEmailAndPhone.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as Schema from './auth.validation.js';
import { validation } from "../../middleware/validation.middleware.js";
const router = Router({ caseSensitive: true });

router.post('/register', asyncHandler(validation(Schema.registerSchema)) ,checkEmailAndPhoneExist, asyncHandler(authController.register));
router.post('/login', asyncHandler(validation(Schema.loginSchema)) , asyncHandler(authController.login));
router.get('/confirmEmail/:token' , asyncHandler(authController.confirmEmail));
router.patch('/sendCode', asyncHandler(validation(Schema.sendCodeSchema)) , asyncHandler(authController.sendCode));
router.patch('/forgetPassword', asyncHandler(validation(Schema.forgetPasswordSchema)) , asyncHandler(authController.forgetPassword));
router.patch('/changePassword', asyncHandler(auth(endPoints.changePassword)), asyncHandler(validation(Schema.changePasswordSchema)), asyncHandler(authController.changePassword));


export default router;