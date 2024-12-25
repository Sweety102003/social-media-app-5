import React ,{useState , useEffect, useRef} from 'react'
import "./profile.css"
export default function Profilepic({changeprofile}) {
const [image,setImage ]=useState("");
const [url , seturl ]=useState("");
    const hiddenfileInput=useRef(null);
    const postDetails =()=>{
        // saving file to cloudinary
             
              const data =new FormData();
              data.append("file",image)
              data.append("upload_preset","socialclone")
              data.append("cloud_name","sweetycloud")
              fetch("https://api.cloudinary.com/v1_1/sweetycloud/image/upload",{
                method:"post",
                body:data
              }).then(res=>res.json()).then( data=>seturl(data.url))
              .catch(err=>console.log(err))
              console.log(url)
              
              
            }


const postPic=()=>{
    {fetch(`${process.env.REACT_APP_BASE_URL}/uploadprofilepic`,{
        method:"put",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " +localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          
          pic:url
        })
      }).then(res=>res.json())
      .then(data=>{
        console.log(data);
        changeprofile();
        window.location.reload();
        })
      .catch(err =>console.log(err))}
    
}

    const handleClick=()=>{
hiddenfileInput.current.click();
    };
    useEffect(()=>{
        if(image){
            postDetails()
        }
    },[image])
    useEffect(()=>{
        if(url)
            {
                postPic();
            }
    },[url])
  return (
    <div className="profilePic darkBg">
        <div className="changePic centered">
            <div>
                <h2>
Change Profile Photo
                </h2>
            </div>
            <div style={{borderTop:"1px solid #00000030 "}}>
                <button className='upload-btn'  onClick={handleClick} style={{color:"blue"}}>Upload photo</button>
                <input type="file"  ref={hiddenfileInput} accept="image/*" 
                 style={{display:"none"}} onChange={(e)=>{
                    setImage(e.target.files[0]);
                 }}
                 ></input>
            </div>
            <div style={{borderTop:"1px solid #00000030 "}}>
                <button className='upload-btn' onClick={()=>{
                    seturl(null);
                    postPic()
                }} style={{color:"red"}}>Remove Current Photo</button>
            </div>
            <div style={{borderTop:"1px solid #00000030 "}}>
                <button onClick={changeprofile} style={{background:"none", border:"none", cursor:"pointer" , fontSize:"15px" }}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

