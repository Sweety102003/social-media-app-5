const jwt =require("jsonwebtoken")
const Jwt_secret=process.env.Jwt_secret;
const mongoose=require("mongoose")
const User = require('../models/model.js');
require('dotenv').config();


module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({error:"you must have logged in "})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, Jwt_secret,(err,payload)=>{
        if(err)
            {
                return res.status(401).json({error:"you must have logged in "})
            }
            const {_id}=payload;
            User.findById(_id).then(userData=>{
                req.user=userData
                next()
// console.log(userData)
            })
    })
    
    // next()
}