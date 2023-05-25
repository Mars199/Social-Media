import userModel from '../../../../DB/model/User.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
import { compare, hash } from "../../../utils/HashAndCompare.js"
import { generateToken , verifyToken } from '../../../utils/GenerateAndVerifyToken.js';
import cloudinary from '../../../utils/cloudinary.js';



export const ShowProfile = asyncHandler(async(req, res ,next)=>{
    const user = await userModel.findById(req.user._id)
        return res.json({message:"Done",user})

})

export const updatePassword =asyncHandler(async(req ,res ,next )=>{
    const { password , newPassword} = req.body 
    console.log({password , newPassword});
    const user = await userModel.findById(req.user._id)
    const match = compare({plaintext:password , hashValue:user.password})
    if(!match){
        return next(new Error('In - valid old password', {cause:400}))
    }
    const hashPassword = hash({plaintext:newPassword})
    user.password=hashPassword;
    await user.save()
    return res.status(200).json({message:"Done"})
}) 

export const profilePic =asyncHandler(async(req, res,next)=>{
    const {userName} = req.body
    console.log({userName});
    if (!req.file) {
        return next(new Error('file is require' ,{cause:400}))
    }
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{ folder:`${process.env.APP_NAME}/Profile]`})
     const user = await userModel.findByIdAndUpdate(req.user._id,
        {profilePic:secure_url,profilePicId:public_id},
        {new:false}
    )
    await cloudinary.uploader.destroy(user.profilePic)
    return res.json({message:"Done" , user})
 
})  

