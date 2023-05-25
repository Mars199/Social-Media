import {roles} from '../../middleware/auth.js'
 export const endPoint = {
    logout : [roles.User]
}
