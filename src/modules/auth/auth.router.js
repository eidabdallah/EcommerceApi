import { Router } from "express";
import * as authController from "./auth.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from './../../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
const router = Router({caseSensitive: true});

router.post('/register' ,validation(registerSchema), asyncHandler(authController.register));
router.post('/login' , validation(loginSchema) , asyncHandler(authController.Login));
router.get('/confirmEmail/:token',asyncHandler(authController.confirmEmail));
export default router;