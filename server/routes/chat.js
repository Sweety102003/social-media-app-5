const express =require("express");
const router=express.Router();
const mongoose =require("mongoose");
const User = require('../models/model.js');
const Message = require('../models/messagemodel.js');
const requirelogin = require("../middlewares/requirelogin.js");
const Chat = require('../models/chatmodel.js');
router.post("/accesschat",requirelogin, async(req,res)=>{
    const {userId}= req.body;
    if(!userId){
        console.log("userid param not sent with req")
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isgroupchat:false,
        $and:[
            {users:{ $elemMatch:{$eq :req.user._id}}},
            {users:{ $elemMatch:{$eq :userId}}},
            

        ]
    }).populate("users","-password").populate("latestMessage");
    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });
    if (isChat.length>0){
        res.send(isChat[0])
    }
    else{
        var chatData={
            chatName:"sender",
            isgroupchat:false,
            users:[req.user._id,userId]
        };
        try{
            const createdChat=await Chat.create(chatData);
            const fullChat= await Chat.findOne({_id:createdChat.id}).populate("users","-password")
            res.status(200).send(fullChat);
        }catch(err){
res.send({error:err.message})
        }
    }
});
router.get("/fetchchats",requirelogin, async(req,res)=>{
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
          
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
router.post("/sendmessage", requirelogin, async(req,res)=>{
    const {content ,chatid}=req.body;
    if(!content || !chatid){
        console.log("invalid info passed ")
        return res.sendStatus(400)
    }
    var newMessage ={
sender:req.user._id,
content: content ,
chat:chatid,
    };
    try{
        var message =await Message.create(newMessage);
        message = await message.populate("sender" ,"name pic ");
        message = await message.populate("chat" );
        message = await User.populate(message,{
            path:'chat.users',
            select:"name pic email"
        });
        await Chat.findByIdAndUpdate(req.body.chatid,{
            latestMessage:message,
        })
        res.json(message);

    }
    catch(error){
        return res.status(400).send({error:error})
    }
})
router.get("/allmessages/:chatid", requirelogin ,async (req,res)=>{
    try{
        const messages= await Message.find({chat:req.params.chatid}).populate("sender", " name pic email")
        .populate("chat");
        res.json(messages);

    }
    catch(err){ return res.status(400).send({err});}
})






module.exports = router;