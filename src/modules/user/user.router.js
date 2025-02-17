import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./user.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
const router = Router({ caseSensitive: true});


router.get('/' , asyncHandler(auth(endPoints.getAllUser)) , asyncHandler(userController.getAllUser));
router.get('/userData' , asyncHandler(auth(endPoints.getUserById)) , asyncHandler(userController.getUserInformation));
router.delete('/:id' , asyncHandler(auth(endPoints.deleteUser)) , asyncHandler(userController.deleteUser));
router.patch('/:id' , asyncHandler(auth(endPoints.updateStatus)) , asyncHandler(userController.updateUserStatus));
router.patch('confimEmail/:id' , asyncHandler(auth(endPoints.changeEmailConfirmation)) , asyncHandler(userController.changeEmailConfirm));


export default router;