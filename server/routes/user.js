const express =require("express");
const router=express.Router();
const mongoose =require("mongoose");
const Post = require("../models/post.js");
const User = require('../models/model.js');
const requirelogin = require("../middlewares/requirelogin.js");

router.get("/user/:id",(req,res)=>{
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user=>{
    Post.find({postedby: req.params.id})
    .populate("postedby","_id")
    .then((post,err)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.status(200).json({user,post})
    })
    }).catch(err=>{
        return res.status(422).json({error:"user not found"})
    })
})
// router.get("/user?search",requirelogin,async (req,res)=>{
//    const keyword=req.query.search ? {
// name:{$regex:req.query.search}
//    }:{};
//  const users=(await User.find(keyword)).find({_id:{$ne:req.user._id}})
//  res.json(users);
// })
router.get("/user", requirelogin, async (req, res) => {
    try {
      const keyword = req.query.search ? {
        name: { $regex: req.query.search, $options: 'i' }
      } : {};
  
      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });




router.put("/follow", requirelogin, async (req, res) => {
    try {
        
        const followedUser = await User.findByIdAndUpdate(
            req.body.followId, 
            { $push: { followers: req.user._id } }, 
            { new: true }
        );

        if (!followedUser) {
            return res.status(422).json({ error: "User to follow not found" });
        }

        
        const currentUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $push: { following: req.body.followId } }, 
            { new: true }
        );

        if (!currentUser) {
            return res.status(422).json({ error: "Current user not found" });
        }

        res.json(currentUser);
    } catch (err) {
        return res.status(422).json({error:err});
    }
});
router.put("/unfollow", requirelogin, async (req, res) => {
    try {
        
        const followedUser = await User.findByIdAndUpdate(
            req.body.followId, 
            { $pull: { followers: req.user._id } }, 
            { new: true }
        );

        if (!followedUser) {
            return res.status(422).json({ error: "User to follow not found" });
        }

        
        const currentUser = await User.findByIdAndUpdate(
            req.user._id, 
            { $pull: { following: req.body.followId } }, 
            { new: true }
        );

        if (!currentUser) {
            return res.status(422).json({ error: "Current user not found" });
        }

        res.json(currentUser);
    } catch (err) {
        return res.status(422).json({error:err});
    }
});

router.put("/uploadprofilepic", requirelogin, (req, res) => {
    User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { Photo: req.body.pic },
      },
      {
        new: true,
      }
    )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(422).json({ error: err.message || 'Something went wrong' });
      });
  });
module.exports = router;