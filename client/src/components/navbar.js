import React,{useContext} from 'react';
import "./navbar.css";
import {Link , useNavigate} from "react-router-dom"
import logo from "../img/logo.png"
import { LoginContext } from "../context/logincontext.js"


export default function Navbar({login}) {
  const navigate=useNavigate();
  const {setmodalOpen}=useContext(LoginContext)
  const loginstatus=()=>{
    const token =localStorage.getItem("jwt")
    if(login || token){
      return [<>
       <Link to="/profile"><li>Profile</li></Link>
       <Link to="/chats"><li>Chats</li></Link>
       

       <Link to="/createpost"><li>Create post</li></Link>
       <Link to="/followingpost"><li>My following Post</li></Link>
       

       <Link to={""}> <button className="primaryBtn" onClick={()=>
        setmodalOpen(true)
       }>Log Out</button></Link>
      </>]
    }
    else{
      return [<>
        <Link to="/signup"><li>Sign Up</li></Link>
        <Link to="/signin"><li>Sign In</li></Link>
       
        </>
       
      ]
    }
  }
  
  return (
    <div className='navbar'>
      <img src={logo} onClick={()=>{navigate("/")}} />
        <h2 >Together</h2>
        <ul>
         
   {loginstatus()}
        </ul>
    </div>
  )
}

