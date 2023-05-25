import commentModel from "../../../../DB/model/Comment.model.js";
import postModel from "../../../../DB/model/Post.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const  createComment = asyncHandler(async(req, res, next)=>{
    req.body.postId = req.params.id
    req.body.createdBy = req.user._id
    const post = await postModel.findById(req.params.id)
    if (!post) {
        return next(new Error("In -valid PostId " , {cause:400}))
        
    }
    const comment = await commentModel.create(req.body)
    post.comment.push(comment._id)
    await post.save() 
    return res.status(201).json({message:"Done" , comment})
})


export const replyComment = asyncHandler( async (req, res,next) => {
    const { text } = req.body;
    const { id, commentID } = req.params;
    const { _id } = req.user

    const post = await postModel.findOne({ _id: id })
    if (!post) {
        return next(new Error("In-valid post id" ,{cause:404}))

    } else {
        const comment = await commentModel.findOne({_id:commentID , postId:post._id})
        if (!comment) {
            return next(new Error("In-valid comment id" ,{cause:404}))
        } else {
            const CRComment = new commentModel({ text, createdBy: _id, postId: post._id })
            const SaveComment = await CRComment.save()
            await commentModel.findByIdAndUpdate(commentID, { $push: { reply: SaveComment._id } })
            res.status(200).json({ message: "Done" })
        }
    }
})



