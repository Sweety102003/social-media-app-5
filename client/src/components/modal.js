import React from 'react'
import {RiCloseLine} from "react-icons/ri"
import "./modal.css"
import { useNavigate } from 'react-router-dom';
export default function Modal({setmodalOpen}) {
    const navigate=useNavigate();
  return (
    <div className='darkBg' onClick={()=>setmodalOpen(false)}>
    <div className="centered">
    <div className="modal">
        <div className="modalHeader">
            <h5 className='heading'>Confirm</h5>
            <button className='closeBtn' onClick={()=>setmodalOpen(false)}>
<RiCloseLine></RiCloseLine>
            </button></div>
            <div className="modalContent">
                Are you really want to log out?
            </div>
            <div className="modalActions">
                <div className="actionsContainer">
                    <button className='logOutBtn' onClick={()=>{
setmodalOpen(false);
localStorage.clear();
navigate("/signin")
                    }}>Log Out</button>
                    <button className='cancelBtn' onClick={()=>setmodalOpen(false)}>cancel</button>
                </div>
            </div>
        </div>
    </div></div>
  )
}
