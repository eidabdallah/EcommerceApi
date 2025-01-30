import { roles } from "../../middleware/auth.middleware.js";
export const endPoints = {
    create : [roles.USER],
    getAllOrder : [roles.ADMIN],
    getOrderForUser : [roles.USER],
    changeStatus : [roles.ADMIN],
}

