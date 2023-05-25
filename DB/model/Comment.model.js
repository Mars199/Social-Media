import mongoose, { model, Schema , Types} from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        min: [2, 'minimum length 2 char'],
        max: [150, 'max length 2 char']
    },
    image:{type:Object},
    postId:{type:Types.ObjectId,ref:'Post',required:true},
    createdBy :{type:Types.ObjectId,ref:'User',required:true},
    like:[{type:Types.ObjectId,ref:'User'}],
    unlike:[{type:Types.ObjectId,ref:'User'}],
    isDeleted:{type:Boolean,default:false},
    reply:[{type:Types.ObjectId,ref:'Comment'}]

},{
    timestamps:true
})
const commentModel =mongoose.models.Comment|| model('Comment' ,commentSchema)
export default commentModel