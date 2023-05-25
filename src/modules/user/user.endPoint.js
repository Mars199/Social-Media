import {roles} from '../../middleware/auth.js'
import { updatePassword } from './user.validation.js'
 export const endPoint = {
    ShowProfile : [roles.User],
    updatePassword:[roles.User],
    profilePic:[roles.User]
}