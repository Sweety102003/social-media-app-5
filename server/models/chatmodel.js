const mongoose =require("mongoose")
const {ObjectId}=mongoose.Schema.Types;
const Chatmodel= new mongoose.Schema(

{
    chatname:{
        type:String,
        trim:true
    },
    isgroupchat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:ObjectId,
        ref:"Message"
    },
    groupadmin:{
        type:ObjectId,
        ref:"User",
    },

},{timestamps:true}
);
const Chat = mongoose.model("Chat",Chatmodel);
module.exports=Chat;