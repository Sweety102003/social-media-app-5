import React , {useState, useEffect} from 'react'
import person1 from "../img/person1.avif"
import "./profile.css"
import { useParams } from 'react-router-dom'
export default function UserProfile() {
  var profilelink="https://cdn-icons-png.flaticon.com/128/149/149071.png";
    const {userid}= useParams();
const[isfollow,setIsfollow]=useState(false);
  const [user ,setUser]=useState("")
  const [posts , setPosts]=useState([]);
  const followuser=(userId)=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/follow`,{
        method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " +localStorage.getItem("jwt")
    },
    body:JSON.stringify({followId:userid})
    }).then((res)=>
        res.json()).then((data)=>{
        console.log(data);
        setIsfollow(true);
    })
  }
  const unfollowuser=(userId)=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/unfollow`,{
        method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " +localStorage.getItem("jwt")
    },
    body:JSON.stringify({followId:userid})
    }).then((res)=>{
        res.json()
    }).then((data)=>{
        console.log(data);
        setIsfollow(false)
    })
  }
  useEffect(()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/user/${userid}`,{
      headers:{
        "Authorization":"Bearer " +localStorage.getItem("jwt")
      }
    }).then(res=>res.json()).
    then((result)=>{
    

      setUser(result.user)
      setPosts(result.post)
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id))
        {
            setIsfollow(true);
        }
    }).catch((err)=>{
    console.log(err);
})
  },[isfollow])
  return (
  <div className="profile">
    <div className="profile-frame">
      <div className="profile-pic">
      <img src={user.Photo? user.Photo:profilelink}  alt =""/>
      </div>
      <div className="profile-data">
        <div style={{display:"flex" , alignItems:"center" ,justifyContent:"space-between"}}><h1>{user?.name}</h1>
        <button className="followBtn"
        onClick={()=>{
            if(isfollow){
                unfollowuser(user._id)
            }else{
            followuser(user._id)}
        }}>
            {isfollow?"Unfollow":"Follow"}
        </button></div>
        
        <div className="profile-info" style={{display:"flex"}}>
          <p>
            {posts?.length} posts
          </p>
          <p>{user.followers?user.followers.length:"0"} followers</p>
          <p>{user.following?user.following.length:"0"} followings</p>
        </div>

      </div>
    </div>
    <hr style={{
      width:"90%",
      margin:" 25px auto",
      opacity:"0.8"

    }}/>
    <div className="gallery">
    {posts?.map((pics)=>{
      return <img  key={pics._id} src={pics.photo} className="item"></img>

    })}
    </div>
  </div>
  )
}
