import {roles} from '../../middleware/auth.js'
 export const endPoint = {
    CreatePost : [roles.User],
    like:[roles.User],
    unlike:[roles.User],
    createComment:[roles.User],
    replyComment:[roles.User]
  
}