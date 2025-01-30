import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoints } from "./user.role.js";
const router = Router({ caseSensitive: true});


router.get('/' , auth(endPoints.getAllUser) , userController.getAllUser);
router.get('/userData' , auth(endPoints.getUserById) , userController.getUserInformation);
router.delete('/:id' , auth(endPoints.deleteUser) , userController.deleteUser);
router.patch('/:id' , auth(endPoints.updateStatus) , userController.updateUserStatus);

export default router;