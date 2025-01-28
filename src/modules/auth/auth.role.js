import { roles } from "../../middleware/auth.middleware.js";

export const endPoints = {
    changePassword : [roles.USER , roles.ADMIN],
}
