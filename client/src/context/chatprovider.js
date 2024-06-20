import { createContext, useContext ,useEffect,useState } from "react";
const chatcontext= createContext();

const ChatProvider =({children})=>{
        const [user,setUser]= useState();
        useEffect(()=>{
const userinfo =JSON.parse(localStorage.getItem("userinfo"));
     setUser(userinfo);
     if(!userinfo){}
     
},[])
      return ( <chatcontext.Provider value={{user,setUser}}>
            {children}
        </chatcontext.Provider>)
    
};
export const ChatState =()=>{
    return useContext(chatcontext);
}

export default ChatProvider;