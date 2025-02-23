import { roles } from "../../middleware/auth.middleware.js";


export const endPoints = {
    getAllUser : [roles.ADMIN],
    getUserById : [roles.USER,roles.ADMIN],
    updateUser : [roles.USER,roles.ADMIN],
    deleteUser : [roles.ADMIN],
    updateStatus : [roles.ADMIN],
    changeEmailConfirmation : [roles.ADMIN],
}