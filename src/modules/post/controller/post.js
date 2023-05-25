import commentModel from '../../../../DB/model/Comment.model.js'
import postModel from '../../../../DB/model/Post.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js'

export const getPosts = asyncHandler(async(req,res,next)=>{
    const postList = await postModel.find({}).populate([
         {
            path: 'createdBy',
            select: "userName  email"
        },
        {
            path: 'comment',
            match:{
                isDeleted:false
            },
            populate: [
                {
                    path: 'createdBy',
                    select: "userName  email"
                },
                {
                    path: 'like',
                    select: "userName  email"
                },
                {
                    path: 'reply',
                    populate: [
                        {
                            path: 'createdBy',
                            select: "userName  email"
                        },
                        {
                            path: 'like',
                            select: "userName  email"
                        },
                        {
                            path: 'reply',
                            populate: [
                                {
                                    path: 'createdBy',
                                    select: "userName  email"

                                },
                                {
                                    path: 'like',
                                    select: "userName  email"
                                }
                            ]
                        }

                    ]
                }
            ]
        }
    ])
    
    
    
    return res.status(201).json({message:"Done" , postList})

})

export const CreatePost = asyncHandler(async(req,res,next)=>{
    const { title ,caption } = req.body
    const { _id } = req.user
    const post = await postModel.create({title ,caption, createdBy : _id})
    return res.status(201).json({message:"Done" , post})

})

export const  likePost = asyncHandler(async(req, res, next)=>{
    const { id } = req.params
    const { _id } =req.user
    const post = await postModel.findByIdAndUpdate(
        {_id :id }
        ,
         {
            $push :{like : _id},
            $pull:{unlike : _id}
        },
        {new : true }
    )
    return res.status(201).json({message:"Done" , post })
})

export const  unlikePost = asyncHandler(async(req, res, next)=>{
    const { id } = req.params
    const { _id } =req.user
    const post = await postModel.findByIdAndUpdate(
        {_id :id }
        ,
         {
            $push :{unlike : _id}, 
            $pull:{like : _id}
        },
        {new : true }
    )
    return res.status(201).json({message:"Done" , post })
})