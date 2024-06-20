import React ,{useEffect , useState ,useContext} from 'react'
import "./signin.css";
import { Link ,useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
import { LoginContext } from "../context/logincontext.js"

export default function Signin() {
const {setuserLogin}=useContext(LoginContext)
  const navigate=useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const notifyA=(message)=> toast.error(message);
  const notifyb=(message)=> toast.success(message);
  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  const postData =()=>{
    if(!emailRegex.test(email))
     {
       notifyA("invalid email")
       return;
     }
    
     // SENDING DATA TO SERVER
     fetch("http://localhost:5000/signin",{
       method:"post",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify({
         
         email:email,
         password:password
       })
 
       
     }).then(res=>res.json())
     .then(data=>{
       if(data.error){
         notifyA(data.error)
       }
       else{
         notifyb("Signed in successfully")
         console.log(data)
         localStorage.setItem("jwt", data.token)
         localStorage.setItem("user", JSON.stringify(data.user))
         setuserLogin(true);
         navigate("/")
       }
       
       console.log(data)})
   }
  return (
    <div className='signIn'>
      <div class="form1">
        <div className='loginForm'>
        <h1 id="signuphead">Sangam</h1>
        <div>
        <input type="email" name="email"id="email" value={email} placeholder="Email" onChange={(e)=>{
    setEmail(e.target.value);
  }}/>
        </div>
        <div>
        <input type="password" name="password"id="password" value={password}  placeholder="Password" 
     onChange={(e)=>{
      setPassword(e.target.value);}}/>
   </div>
   <input type="submit" id="login-btn" value="Sign In" onClick={()=>{postData()}} />
        </div>
        <div className="loginForm2">
          Don't have an account ? 
          <Link to="/signup">
          <span style={{color:"blue",cursor:"pointer"}}>Sign Up</span></Link>
        </div>
      </div>
    </div>
  )
}
