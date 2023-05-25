import { asyncHandler } from '../../../utils/errorHandling.js'
import userModel from "../../../../DB/model/User.model.js"
import { generateToken , verifyToken } from '../../../utils/GenerateAndVerifyToken.js';
import { compare, hash } from "../../../utils/HashAndCompare.js"
import sendEmail from '../../../utils/email.js';






export const signup = asyncHandler(async(req,res,next)=>{
    const {userName , email ,  password}=req.body;
    const user = await userModel.findOne({email})
    if (user) {
        return next(new Error("Email exist" , {cause:409} ))
    }
    // Send Email .............
    const token = generateToken({payload:{email} ,signature:process.env.EMAIL_TOKEN, expiresIn:60 * 5})
    const RELinlToken = generateToken({payload:{email} ,signature:process.env.EMAIL_TOKEN, expiresIn: 60 * 60 * 24})

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const RElink = `${req.protocol}://${req.headers.host}/auth/NewConfirmEmail/${RELinlToken}`

    const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                <tr>
                <td>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <a href="${RElink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`
    
        if (!await sendEmail({to:email , subject :'confirmation - Email' , html})) {
            return next(new Error("Email rejected" , {cause:400}))
        
    }
    const hashPassword = hash({plaintext:password})
        const CreateUser = await userModel.create({userName , email , password : hashPassword   })
        return res.status(201).json({message:"Done" , user:CreateUser._id})

})



export  const confirmEmail = asyncHandler(async(req, res,next)=>{
    const {token} = req.params
    const {email} = verifyToken({token , signature:process.env.EMAIL_TOKEN})
    if (!email) {
        return next(new Error("In - valid token payload" , {cause:400}))
    }
    
    const user = await userModel.updateOne({email:email},{confirmEmail:true})
    if (user.matchedCount) {
        return res.status(200).redirect(`${process.env.FE_URL}/#/login`)
    }else{
        return res.status(200).json({message:"Not register account "})
        }
}) 


export  const NEWconfirmEmail = asyncHandler(async(req, res,next)=>{
    const {token} = req.params
    const {email} = verifyToken({token , signature:process.env.EMAIL_TOKEN})
    if (!email) {
        return next(new Error("In - valid token payload" , {cause:400}))
    }
    
    const user = await userModel.findOne({email:email})
    if (!user) {
        return next(new Error ("Not register account " , {cause:404}))
        
    }if (user.confirmEmail ) {
        return res.status(200).redirect(`${process.env.FE_URL}/#/login`)
        
    }
    const newToken = generateToken({payload:{email} ,signature:process.env.EMAIL_TOKEN, expiresIn:60 * 5}) 
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const RElink = `${req.protocol}://${req.headers.host}/auth/NewConfirmEmail/${token}`

    const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                <tr>
                <td>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <a href="${RElink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`
    
        if (!await sendEmail({to:email , subject :'confirmation - Email' , html})) {
            return next(new Error("Email rejected" , {cause:400}))
    }
    return res.status(200).send("<p> New confirmation email sent to your inbox plz check again  </p>")
}) 



export const logIn = asyncHandler(async(req, res, next)=>{
        const {email , password}= req.body
        const user = await userModel.findOne({email})
        if (!user) {
            return next(new Error("Email Not Exist" , { cause:404})) 
        }
        if (!user.confirmEmail) {
            return next(new Error("please confirm your email " , {cause:400}))
            
        }
        const match = compare({plaintext:password , hashValue:user.password})
        if(!match){
            return next(new Error('IN- valid login data ' , {cause:400})) 
        }
        const access_Token = generateToken({
            payload:{id:user._id ,role:user.role},
            expiresIn:60 * 30 
        })
         const refresh_Token = generateToken({
            payload:{id:user._id ,role:user.role},
            expiresIn:60 * 60 * 24 * 365 
        })
        user.status = "Online"
        await user.save()
        return res.status(200).json({message:"Done" ,access_Token ,refresh_Token} )

}) 


export const sendCode = asyncHandler(async(req,res,next)=>{
    const {email} = req.body
    const code = Math.floor(Math.random()*(9999-1000+1)+1000)
    const user = await userModel.findOneAndUpdate({email},{code})
    if (!user) {
        return next(new Error('In - valid account' , {cause:400}))
    }
     const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Reset Password</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${code}</p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`
    
        if (!await sendEmail({to:email , subject :'Forget password' , html})) {
            return next(new Error("Email rejected" , {cause:400}))
        
    }
    
    return res.status(200).json({message:"Done"})

})



export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const {email , password , code} = req.body
    const user = await userModel.findOne({email})
    if (!user) {
        return next(new Error('In - valid account' , {cause:400}))
    }
    if (user.code !== parseInt(code) ) {
        return next(new Error('In - valid reset code' , {cause:400}))
    }
    user.password = hash({plaintext:password})
    user.code = null;
    await user.save()
    return res.status(200).json({message:"Done"})

})

export const logout = asyncHandler(async(req, res, next)=>{
    const user = await userModel.findByIdAndUpdate({_id: req.user._id,isLoggedIn : true} , {
    isLoggedIn : false , LoggedOutAt :Date.now()
   })
   if (user) {
     return res.status(200).json({message:"Done" })
   }
  
    return next(new Error('Fail to logOu' , {cause:400}))

})

