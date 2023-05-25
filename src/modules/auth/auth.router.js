import { Router } from "express";
import * as validators from './auth.validation.js'
import { validation } from '../../middleware/validation.js';
//import fileUpload , fileValidation from '../../utils/multer.js'
import {auth , roles}from '../../middleware/auth.js'
import *as authController from './controller/registration.js'
import  {endPoint}  from "./auth.endPoint.js";
const router = Router()


router.post("/" , authController.signup)
 
router.post("/signup" 
,validation(validators.signup),
 authController.signup)

router.post("/login",
validation(validators.logIn),
 authController.logIn)

router.get("/confirmEmail/:token" , 
validation(validators.token),
authController.confirmEmail)

router.get("/NEWconfirmEmail/:token" ,
validation(validators.token), 
authController.NEWconfirmEmail)

router.patch("/sendcode" ,
validation(validators.sendCode),
 authController.sendCode)


router.put("/forgetPassword" ,
validation(validators.forgetPassword),
 authController.forgetPassword)
 
router.post("/logout"  ,auth(endPoint.logout),authController.logout)
export default router