
import React,{useEffect,useState} from 'react'
import "./home.css"
import person1 from "../img/person1.avif"
import {  toast } from 'react-toastify';
import { useNavigate ,Link } from 'react-router-dom';
export default function Myfollowingpost() {
  const navigate = useNavigate();
  const notifyA=(message)=> toast.error(message);
  const notifyb=(message)=> toast.success(message);
  const [data,setData]=useState([]);
  const [loading, setLoading] = useState(true);
  const [comment,setComment]=useState(""); 
  const [show , setShow]= useState(false);
  const [item,setItem]= useState([]);
  useEffect(()=>{
    const token =localStorage.getItem("jwt");
if(!token)
  {navigate("/signup");}
// fetch request
fetch(`${process.env.REACT_APP_BASE_URL}/myfollowingpost`,{
  headers:{
    Authorization:"Bearer " +localStorage.getItem("jwt")
  },


}).then(res=>res.json())
.then((result)=>
  {console.log(result)
     setData(result)
     setLoading(false);})
.catch(err=>{console.log(err);
  setLoading(false)

})

  },[navigate]);
const toggleComment=(posts)=>{
  if(show){
    setShow(false)
    
  }
  else{
    setItem(posts);
    console.log(item)
    setShow(true)
  }
}


  const likepost =(id)=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/like`,
     {method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer " +localStorage.getItem("jwt")

      },
      body:JSON.stringify({
        postId:id,
      }),

  }).then(res=>res.json())
  
  .then((result) => {
    console.log(result)
    if (result && result._id) {
      const newData = data.map((post) => {
        return post?._id === result._id ? result : post;
      });
      setData(newData);
    }
  })
  .catch((err) => console.log(err));
};
  const unlikepost =(id)=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/unlike`,
     {method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer " +localStorage.getItem("jwt")

      },
      body:JSON.stringify({
        postId:id
      })

  }).then(res=>res.json())
  
  .then((result) => {
    console.log(result)
    if (result && result._id) {
      const newData = data.map((post) => {
        return post?._id === result._id ? result : post;
      });
      setData(newData);
    }
  })
  .catch((err) => console.log(err));
};

  

  if (loading) {
    return <div>Loading...</div>; // Render loading state while fetching data
  }

  const makeComment =(text , id)=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/comment`,
      {method:"put",
       headers:{
         "Content-Type":"application/json",
         Authorization:"Bearer " +localStorage.getItem("jwt")
 
       },
       body:JSON.stringify({
text:text,
         postId:id,
       }),
 
   }).then(res=>res.json())
   
   .then((result) => {
    
       const newData = data.map((post) => {
         return post?._id === result._id ? result : post;
       });
       setData(newData);
       console.log(result);
      
     
     setComment("");
       notifyb("Comment posted")
   
   })
   .catch((err) => console.log(err));
  }


  return (
    <div className='home'>
      {data.length === 0 ? (
        <div>No posts available</div> // Handle case when no data is available
      ) : (
      data.map((posts)=>{
        // if(!posts)
        //   {
        //     return null;
        //   }
 return( <div className="card"  key={posts?._id}>
  <div className="card-header">
    <div className='card-pic'>
      <img src={person1} alt =""/>
    </div>
    <h5>
      <Link to ={`/profile/${posts.postedby._id}`}>{posts?.postedby.name}</Link></h5>
  
  </div>
  <div className="card-image">
    <img src={posts.photo} alt=" "/>
  </div>
  <div className="card-content">

  {localStorage.getItem('jwt') && posts?._id && (
                posts?.likes.includes(JSON.parse(localStorage.getItem('user'))._id) ? (
                  <span
                    className="material-symbols-outlined material-symbols-outlined-red"
                    onClick={() => unlikepost(posts?._id)}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => likepost(posts?._id)}
                  >
                    favorite
                  </span>
                )
              )}
       
  
  
  <p>{posts.likes.length} like</p>
  <p>{posts.body}</p>
  <p style={{fontWeight:'bold' , cursor:"pointer"}} 
  onClick={()=>{
    toggleComment(posts)
  }}> View all comments</p>
  
  </div>
  <div className='add-comment'>
  <span className="material-symbols-outlined">
  mood
  </span>
  <input type="text" placeholder="add a comment" value={comment} onChange={(e)=>{
    setComment(e.target.value)
  }} />
  <button className="comment" onClick={()=>{
    makeComment(comment,posts?._id);
  }}>Post</button>
  </div>
        </div>
     )}))}
    
    {show&&
   ( <div className="showComment">
      <div className='container'>
        <div className="postPic">
<img src={item.photo} />
        </div>
        <div className='details'>
        <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
    <div className='card-pic'>
      <img src={person1} alt =""/>
    </div>
    <h5>{item.postedby.name} </h5>
  
  </div>
  <div className="comment-section" style={{borderBottom:"1px solid #00000029"}}>
    {item.comments.map((comment)=>{
      return ( <p className="comm">
  <span className='commenter' style={{fontWeight:"bolder"}}>{comment.postedby.name} </span>
  <span className="commentText">{comment.comment}</span>
</p>)
    })}
   
    
  </div>
  <div className='card-content'>
    <p>{item.likes.length}likes </p>
    <p>{item.body}</p>
  </div>
  <div className='add-comment'>
  <span className="material-symbols-outlined">
  mood
  </span>
  <input type="text" placeholder="add a comment" value={comment} onChange={(e)=>{
    setComment(e.target.value)
  }} />
  <button className="comment"
   onClick={()=>{
    makeComment(comment,item._id);
    toggleComment();
  }}
  >Post</button>
  </div>
        </div>
      </div>
      <div className="close-comment" onClick={()=>{
        {
          toggleComment()
        }
      }}>
      <span className="material-symbols-outlined material-symbols-outlined-comment">
close
</span>
      </div>
      </div>)}
      </div>
  )
}
