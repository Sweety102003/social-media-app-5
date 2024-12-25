import React , {useState, useEffect} from 'react'
import person1 from "../img/person1.avif"
import "./profile.css"
import Profilepic from './profilepic.js'
export default function Profile() {
  var profilelink="https://cdn-icons-png.flaticon.com/128/149/149071.png";
  const [pic,setPic]=useState([])
  const [user,setUser]=useState("")

  const [changepic , setChangepic]=useState(false)
  useEffect(()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
        "Authorization":"Bearer " +localStorage.getItem("jwt")
      }
    }).then(res=>res.json()).
    then((result)=>{
      setPic(result.post);
      setUser(result.user)
    })
  },[])
  const changeprofile=()=>{
    if(changepic){
      setChangepic(false)
    }else{setChangepic(true);}
  }
  return (
  <div className="profile">
    <div className="profile-frame">
      <div className="profile-pic">
      <img  onClick={changeprofile} src={user.Photo? user.Photo:profilelink} alt =""/>
      </div>
      <div className="profile-data">
        <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
        <div className="profile-info" style={{display:"flex"}}>
          <p>{pic? pic.length:"0"} posts
          </p>
          <p>{user.followers?user.followers.length:"0"} followers</p>
          <p>{user.following?user.following.length:"0"} following</p>
        </div>

      </div>
    </div>
    <hr style={{
      width:"90%",
      margin:" 25px auto",
      opacity:"0.8"

    }}/>
    <div className="gallery">
    {pic.map((pics)=>{
      return <img  key={pics._id} src={pics.photo} className="item"></img>

    })}
    </div>
    {changepic && <Profilepic changeprofile={changeprofile} />}
  </div>
  )
}
