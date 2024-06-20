const express =require("express");
const router=express.Router();
const mongoose =require("mongoose");
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const Jwt_secret=process.env.Jwt_secret;
const User = require('../models/model.js');

// const { Jwt_secret } = require("../key.js");
const requirelogin = require("../middlewares/requirelogin.js");
router.get('/',(req,res)=>{
    res.send("hello")
})
router.get('/signup',(req,res)=>{
    res.send("hello user ready ")
})
router.get('/signin',(req,res)=>{
    res.send("hello user ready33 ")
})


router.post("/signup",(req,res)=>{
    const{name,userName,email,password}=req.body;
    if(!name || !email || !userName || !password )
        {
           return res.status(422).json({error:"please add all the fields "})
        }
        User.findOne({$or:[{email:email},{userName:userName}]}).then((saveduser)=>{
            if(saveduser)
                {
                   return res.status(422).json({error:"user already exists with that email or username "})
                }
        
        bcrypt.hash(password,12).then((hashedpassword)=>{
            const user =new User({
                name,
                userName,
                email,
                password
                :hashedpassword
 } );
            user.save()
            .then(user=>{res.json({message:"registered successfully"})})
            .catch(err=>{console.log(err)})
        });
  
})
})
router.post("/signin",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(422).json({error:"please add email and password"})
    }
    User.findOne({email:email}).then((saveduser)=>{
       if(!saveduser){
        return res.status(422).json({error:"invalid email"})
       }
    bcrypt.compare(password,saveduser.password).then((match)=>{
        if(match){
        //     return res.status(200).json({message:"signed in successfully"})
        // }
        const token =jwt.sign({_id:saveduser.id},Jwt_secret);
        const {_id, name,email,userName}=saveduser
        res.json({token,user:{_id, name,email,userName}});
        console.log({token,user:{_id, name,email,userName}});
        }

        else{
            return res.status(422).json({error:"invalid password"})
        }
    }).catch(err=>console.log(err))
    

    })
})

module.exports=router;