import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const CreatePost = joi.object({
        title:joi.string(). min(5).max(1500).required(),
        caption:joi.string(). min(5).max(1500).required()
    }).required()

export const likeOrUnlikePost = joi.object({
        id:generalFields.id
    }).required()

export const createComment = joi.object({
    text:joi.string().min(5).max(1500).required(),
    id:generalFields.id,
}).required()
export const replyComment = joi.object({
    text:joi.string().min(5).max(1500).required(),
    commentID:generalFields.id,
    id:generalFields.id

}).required()