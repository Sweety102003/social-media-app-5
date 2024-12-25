import React,{useEffect , useState} from 'react'
import "./signup.css"
import { Link ,useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';
export default function Signup() {
  const navigate=useNavigate();
  const [name, setName]=useState("");
  const [email,setEmail]=useState("");
  const [userName, setuserName]=useState("");
  const [password,setPassword]=useState("");
  const notifyA=(message)=> toast.error(message);
  const notifyb=(message)=> toast.success(message);
  const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passregex=/^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const postData =()=>{
   if(!emailRegex.test(email))
    {console.log("invalid email")
      notifyA("invalid email")
      return;
      
    }
    else if(!passregex.test(password))
      {
        notifyA("Password must contain atleast 8 characters including no's ,alphabets and special characters #")
        return;
      }
    // SENDING DATA TO SERVER
    fetch(`${process.env.REACT_APP_BASE_URL}/signup`,{
      method:"post",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        name:name,
        userName:userName,
        email:email,
        password:password
      })

      
    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        notifyA(data.error)
      }
      else{
        notifyb(data.message)
        navigate("/signin")
      }
      
      console.log(data)})
  }
  return (
    <div className="signUp">
     <div className="form-container">
      <div class="form">
<h1 id="signuphead">Sangam</h1>
<p className='loginPara'>
  Sign up to see photos and videos<br />from your friends

</p>
<div>
  <input type="email" name="email"id="email" value={email} placeholder="Email" onChange={(e)=>{
    setEmail(e.target.value);
  }}/>
</div>
     
     <div>
  <input type="text" name="name"id="name" value={name} placeholder="Full name" onChange={(e)=>{
    setName(e.target.value)}} />
</div>
     
     <div>
     <input type="username" name="username"id="username" value={userName} placeholder="Username"
     onChange={(e)=>{
      setuserName(e.target.value);}} /> 
   </div>
   <div>
     <input type="password" name="password"id="password" value={password}  placeholder="Password" 
     onChange={(e)=>{
      setPassword(e.target.value);}}/>
   </div>
   <p className="loginPara" style={{fontSize:"12px", margin:"3px 0px"}}>
    By signing up ,you agree to our terms ,<br />privacy and cookies policies
   </p>
   <input type="submit" id="submit-btn" value="Sign Up" onClick={()=>{
    postData()
   }}/>
   </div>
   <div className="form2">
    Already have an account ?
   <Link to="/signin">
    <span style={{color:"blue",cursor:"pointer"}}>Sign In</span>
    </Link>
   </div>
</div>

    </div>
  )
}
