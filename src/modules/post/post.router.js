import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from '../../middleware/validation.js';
import * as validators from './post.validation.js'
import  {endPoint}  from "./post.endPoint.js";
import {fileUpload, fileValidation} from '../../utils/multer.js'
import * as postController from './controller/post.js'
import * as commentController from './controller/comment.js'
const router = Router()




router.get('/', postController.getPosts)
router.post("/Create" ,
 auth(endPoint.CreatePost),
 validation(validators.CreatePost),
 postController.CreatePost)

router.patch("/:id/like" ,
 auth(endPoint.like),
 validation(validators.likeOrUnlikePost),
 postController.likePost )

router.patch("/:id/unlike" ,
 auth(endPoint.unlike),
 validation(validators.likeOrUnlikePost),
 postController.unlikePost )
// Comment.Router Section  ..........................................................
router.post("/:id/comment" ,
 auth(endPoint.CreatePost),
 validation(validators.createComment),
 commentController.createComment)

router.patch("/:id/comment/:commentID/reply" ,
 auth(endPoint.CreatePost),
 validation(validators.replyComment),
 commentController.replyComment)


export default router