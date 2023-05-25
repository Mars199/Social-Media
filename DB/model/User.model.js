import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({

    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    }, image: {
        type: Object,

    },

    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },

    status: {
        type: String,
        default: "Offline",
        enum: ['Online', 'Offline', 'Blocked']
    }, isLoggedIn: {
        type: Boolean,
        default: false
    },

    confirmEmail: {
        type: Boolean,
        default: false,
    }, code: {
        type: Number,
        default: null
    }
    ,
    LoggedInAt: Date,
    profilePic: String,
    profilePicId: String,
    imagePublicId: String,
    coverPic: [],
    LoggedOutAt: Date,
    DOB: String,
}, {
    timestamps: true
})


const userModel = mongoose.models.User || model('User', userSchema)
export default userModel