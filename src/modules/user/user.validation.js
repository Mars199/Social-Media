import  joi from 'joi'
import { generalFields } from "../../middleware/validation.js";

export const updatePassword = joi.object({
        password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        newPassword:joi.string().invalid(joi.ref('oldPassword')).pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword:joi.string().valid(joi.ref("newPassword")).required()
    }).required()

export const profilePic = joi.object({
    file:generalFields.file,
    userName:joi.string() .min(2).max(25),

}).required()