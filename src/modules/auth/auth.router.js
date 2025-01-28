import { Router } from "express";
import * as authController from "./auth.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./auth.role.js";
const router = Router({ caseSensitive: true });

router.post('/register' , authController.register);
router.post('/login', authController.login);
router.get('/confirmEmail/:token',authController.confirmEmail);
router.patch('/sendCode' , authController.sendCode);
router.patch('/forgetPassword',authController.forgetPassword);
router.patch('/changePassword',auth(endPoints.changePassword),authController.changePassword);


export default router;