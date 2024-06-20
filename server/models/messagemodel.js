const mongoose =require("mongoose")
const {ObjectId}=mongoose.Schema.Types;
const messagemodel= new mongoose.Schema({
    sender:{
        type:ObjectId,
        ref:"User"    },
        content:{
            type:String,
            trim:true,
        },
        chat:{
            type:ObjectId,
            ref:"Chat"
        },
},{timestamps:true,});
const Message=mongoose.model("Message",messagemodel);
module.exports=Message;