import { Router } from "express";
import * as authController from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./auth.role.js";
import { checkEmailAndPhoneExist } from "../../middleware/checkEmailAndPhone.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true });

router.post('/register', checkEmailAndPhoneExist, asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));
router.patch('/sendCode', asyncHandler(authController.sendCode));
router.patch('/forgetPassword', asyncHandler(authController.forgetPassword));
router.patch('/changePassword', asyncHandler(auth(endPoints.changePassword)), asyncHandler(authController.changePassword));


export default router;