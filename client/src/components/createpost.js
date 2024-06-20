import React, {useState ,useEffect} from 'react'
import "./createpost.css"
import person1 from "../img/person1.avif"
import image1 from "../img/image.png"
import { useNavigate } from 'react-router-dom';
import {  toast } from 'react-toastify';
export default function Createpost() {
  const [body , setBody]=useState("");
  const [image , setImage]=useState("");
  const [url,setUrl]=useState("");
  const notifyA=(message)=> toast.error(message);
  const notifyb=(message)=> toast.success(message);
  const navigate=useNavigate();


  useEffect(()=>{ 
    if(url)
    {fetch("http://localhost:5000/createpost",{
    method:"post",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " +localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      body,
      pic:url
    })
  }).then(res=>res.json())
  .then(data=>{if(data.error)
    {
      notifyA(data.error)
    }
    else{
      notifyb("successfully posted")
      navigate("/")

    }
    })
  .catch(err =>console.log(err))}

  },[url])

    const postDetails =()=>{
// saving file to cloudinary
      console.log(body,image)
      const data =new FormData();
      data.append("file",image)
      data.append("upload_preset","socialclone")
      data.append("cloud_name","sweetycloud")
      const endpoint = image.type.startsWith('video') 
      ? "https://api.cloudinary.com/v1_1/sweetycloud/video/upload" 
      : "https://api.cloudinary.com/v1_1/sweetycloud/image/upload";
      fetch(endpoint,{
        method:"post",
        body:data
      }).then(res=>res.json()).then( data=>setUrl(data.url))
      .catch(err=>console.log(err))
      console.log(url)
      
      //
    }
    

        // const loadFile = function(event) {
        //     var output = document.getElementById('output');
        //     output.src = URL.createObjectURL(event.target.files[0]);
        //     output.onload = function() {
        //       URL.revokeObjectURL(output.src) // free memory
        //     }
        //   };
        const loadFile = function (event) {
          const file = event.target.files[0];
          setImage(file);
          const outputContainer = document.getElementById('output');
          outputContainer.innerHTML = ''; 
      
          if (file.type.startsWith('image')) {
            const img = document.createElement('img');
            img.id = 'output';
            img.src = URL.createObjectURL(file);
            img.onload = function () {
              URL.revokeObjectURL(img.src); 
            }
            outputContainer.appendChild(img);
          } else if (file.type.startsWith('video')) {
            const video = document.createElement('video');
            video.id = 'output';
            video.src = URL.createObjectURL(file);
            video.controls = true;
            video.onloadeddata = function () {
              URL.revokeObjectURL(video.src); 
            }
            outputContainer.appendChild(video);
          }
        };
    
  return (
    <div className='createpost'>
        <div className="post-header">
            <h4 style={{margin:"3px auto"}}> Create New Post </h4>
            <button id="post-btn" onClick={()=>{postDetails()}}>Share</button>
        </div>
        <div className="main-div">
            {/* <img id="output" src={image1}></img> */}
            <div id="output">
            {/* {image1 && image1.type.startsWith('image') ? (
                <img id="output" src={URL.createObjectURL(image1)} alt="preview" />
            ) : image1 && image1.type.startsWith('video') ? (
                <video id="output" src={URL.createObjectURL(image1)} controls />
            ) : (
                <div id="output"></div> 
            )} */}
        </div>
        
            <input type ="file" accept="image/* , video/*" onChange={(event)=>{
loadFile(event);
setImage(event.target.files[0])
            }}/>
        </div>
        <div className="details">
            <div className="card-header" >
            <div className='card-pic'>
            <img src={person1} alt =""/>
            </div>
            <h5>Samayra hooda</h5>
        </div></div>
        <textarea value={body}  onChange ={(e)=>{
          setBody(e.target.value)
        }}
        type="text"placeholder="Write a caption" />
    </div>
  )
}

