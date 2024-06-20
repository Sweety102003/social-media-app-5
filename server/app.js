const express =require("express")
const app=express();
const mongoose =require("mongoose");
require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;
const Jwt_secret=process.env.Jwt_secret;

const cors=require("cors")
app.use(cors());
require('./models/model')
require('./models/post')
require('./models/chatmodel')
require('./models/messagemodel')
app.use(express.json())
app.use(require("./routes/auth.js"))
app.use(require("./routes/createpost.js"))
app.use(require("./routes/user.js"))
app.use(require("./routes/chat.js"))

mongoose.connect(MONGODB_URL);

const PORT =5000;

mongoose.connection.on("connected",()=>{
    console.log("successfully connected to mongo")
})
mongoose.connection.on("error",()=>{
    console.log("successfully not  connected to mongo")
})

const server = app.listen(PORT,()=>
    {
console.log("Server is running on  " +PORT)
    })
    const io= require('socket.io')(server,{
        pingTimeout:600000,
        cors:{
            origin:"http://localhost:5000",
        }
    })
    io.on("connection",(socket)=>{
        console.log("connected to socket.io")
        socket.on('setup',(userData)=>{
            socket.join(userData._id)
            console.log(userData._id)
            socket.emit("connected")
        })
    })