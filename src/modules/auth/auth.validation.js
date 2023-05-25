
import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const signup = joi.object({
    userName:joi.string().alphanum() .min(2).max(25).required(),
    email:generalFields.email,
    password:generalFields.password,
    cPassword:generalFields.cPassword.valid(joi.ref('password'))
    //file:generalFields.file.required()
}).required()


export const token = joi.object({
    token:joi.string().required(),
}).required()



export const logIn = joi.object({
    email:generalFields.email,
    password:generalFields.password
}).required()

export const sendCode = joi.object({
    email:generalFields.email,
}).required()

export const forgetPassword = joi.object({
    code:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).required(),
    email:generalFields.email,
    password:generalFields.password,
    cPassword:generalFields.cPassword.valid(joi.ref('password'))
}).required()
