import { roles } from "../../middleware/auth.middleware.js";
export const endPoints = {
    getCart : [roles.USER],
    create : [roles.USER],
    delete : [roles.USER],
    clear : [roles.USER],
    updateProductQuantity : [roles.USER],
}

