const express =require("express");
const router=express.Router();
const mongoose =require("mongoose");
const requirelogin = require("../middlewares/requirelogin");
const Post = require("../models/post.js");

router.get('/createpost',(req,res)=>{
    res.send("hello  user")
})
router.get("/allposts",requirelogin,(req,res)=>{
    Post.find().populate("postedby" , "_id name Photo")
    .populate("comments.postedby" , "_id name")
    .sort("-createdAt")
    .then(posts=>res.json(posts))
    .catch(err =>console.log(err))
})

router.post("/createpost",requirelogin,(req,res)=>{
    const{body ,pic}=req.body;
    if(! body || !pic ){
        return res.status(422).json({error:"please add all the fields"})
    }
    
    const post=new Post({
        body,
        photo:pic,
        postedby:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
})
router.get("/myposts",requirelogin,(req,res)=>{
Post.find({postedby:req.user._id})
.populate("postedby", "_id name")
.sort("-createdAt")
.then(myposts=>{
    res.json(myposts)
})
})
// router.put("/like",requirelogin,(req,res)=>{
//     Post.findByIdAndUpdate(req.body.postId,{$push:{likes:req.user._id}},{new:true}).exec((err,result)=>{
//         if(err)
//             {
//                 return res.status(422).json({error:err})
//             }
//             else{
//                 res.json(result)
//             }
//     })
// })
router.put("/like", requirelogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedby", "_id name Photo");
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});
router.put("/unlike", requirelogin, async (req, res) => {
    try {
        const result = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedby", "_id name Photo");;
        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});
// router.put("/unlike",requirelogin,(req,res)=>{
//     Post.findByIdAndUpdate(req.body.postId,{$pull:{likes:req.user._id}},{new:true}).exec((err,result)=>{
//         if(err)
//             {
//                 return res.status(422).json({error:err})
//             }
//             else{
//                 res.json(result)
//             }
//     })
// })
router.put("/comment",requirelogin, async (req,res)=>{
    try {
   
    const comment = {
        comment:req.body.text,
        postedby:req.user._id
    }
     const result = await Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
    ).populate("comments.postedby","._id name")
    res.json(result);
} catch (err) {
    res.status(422).json({ error: err });
}
})
router.get("/myfollowingpost",requirelogin,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}}).populate("postedby","_id name").populate("comments.postedby","_id name").then(posts=>{res.json(posts)})
    .catch(err =>{console.log(error)})
 
})
module.exports = router