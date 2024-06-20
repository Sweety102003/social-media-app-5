const mongoose =require("mongoose");
const {ObjectId}=mongoose.Schema.Types
const postSchema= new mongoose.Schema({

body:{
    type:String,
    required:true
},
photo:{
type:String,
required:true
},
likes:[{
    type:ObjectId,  ref:"User"
}],
comments:[{
    comment:{
        type:String
    },
    postedby:{
           type:ObjectId,  ref:"User"
    }
}],
postedby:{
    type:ObjectId,
    ref:"User"
}

},{timestamps:true})
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
