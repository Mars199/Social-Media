import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import  {endPoint}  from "./user.endPoint.js";
import { validation } from '../../middleware/validation.js';
import * as validators from './user.validation.js'
import {fileUpload, fileValidation} from '../../utils/multer.js'

const router = Router()
import *as userController from './controller/user.js'



router.get('/profile' , auth(endPoint.ShowProfile),
userController.ShowProfile )

router.patch("/password" ,
 validation(validators.updatePassword)
 ,auth(endPoint.updatePassword) , 
 userController.updatePassword)

 router.put('/profilePic' ,auth(endPoint.profilePic),
  fileUpload(fileValidation.image).single('image'),
  validation(validators.profilePic)
 ,userController.profilePic)


export default router