import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./user.role.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as Schema from './user.validation.js';
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
const router = Router({ caseSensitive: true});


router.get('/' , asyncHandler(auth(endPoints.getAllUser)) , asyncHandler(userController.getAllUser));
router.get('/userData' , asyncHandler(auth(endPoints.getUserById)) , asyncHandler(userController.getUserInformation));
router.delete('/:id' , asyncHandler(validation(Schema.deleteUserSchema))  , asyncHandler(auth(endPoints.deleteUser)) , asyncHandler(userController.deleteUser));
router.patch('/:id' , asyncHandler(validation(Schema.updateUserStatusSchema))  , asyncHandler(auth(endPoints.updateStatus)) , asyncHandler(userController.updateUserStatus));
router.patch('/' , fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(Schema.updateUserInformationSchema))  , asyncHandler(auth(endPoints.updateUser)) , asyncHandler(userController.updateUserInformation));
router.patch('confimEmail/:id' ,asyncHandler(validation(Schema.changeEmailConfirmSchema))  , asyncHandler(auth(endPoints.changeEmailConfirmation)) , asyncHandler(userController.changeEmailConfirm));


export default router;