import { roles } from "../../middleware/auth.middleware.js";
export const endPoints = {
    create : [roles.ADMIN],
    getAll : [roles.ADMIN],
    getById : [roles.ADMIN],
    update : [roles.ADMIN],
    delete : [roles.ADMIN],
}

