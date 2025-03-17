import { roles } from "../../middleware/auth.middleware.js";
export const endPoints = {
    create : [roles.ADMIN],
    AllProducts : [roles.ADMIN , roles.USER],    
    getProduct : [roles.ADMIN , roles.USER],
    delete : [roles.ADMIN],
    update : [roles.ADMIN]
}

