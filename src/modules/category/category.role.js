import { roles } from "../../middleware/auth.middleware.js";


export const endPoints = {
    create : [roles.ADMIN],
    getAll : [roles.ADMIN],
    getAllActive : [roles.USER , roles.ADMIN],
    getById : [roles.USER , roles.ADMIN],
    update : [roles.ADMIN],
    delete : [roles.ADMIN]
}