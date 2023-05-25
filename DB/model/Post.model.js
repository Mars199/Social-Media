import mongoose, { model, Schema,Types } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        min: [2, 'minimum length 2 char'],
        max: [100, 'max length 2 char']
    },
    caption:{type: String,
        required: true,
        min: [2, 'minimum length 2 char'],
        max: [100, 'max length 2 char']},
    image:{type:Object,required:false},  
    createdBy :{type:Types.ObjectId,ref:'User',required:true},
    like:[{type:Types.ObjectId,ref:'User'}],
    unlike:[{type:Types.ObjectId,ref:'User'}],
    comment:[{type:Types.ObjectId,ref:'Comment'}],
    isDeleted:{type:Boolean , default:false}

},{
    timestamps:true
})
const postModel =mongoose.models.Post|| model('Post' ,postSchema)
export default postModel