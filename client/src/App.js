import './App.css';
import Navbar from './components/navbar';
import React ,{ createContextContext, useState} from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Profile from './components/profile';
import Signin from './components/signin';
import Signup from './components/signup';
import Home from './components/Home';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Createpost from './components/createpost';
import  { LoginContext } from "./context/logincontext.js";
import Modal from './components/modal.js';
import UserProfile from './components/userprofile.js';
import Myfollowingpost from './components/myfollowingpost.js';
import Chat from './components/chat.js';
import ChatProvider from './context/chatprovider.js';
import { ChakraProvider } from '@chakra-ui/react';


  

function App() {
  const [userLogin,setuserLogin]=useState(false);
  const [modalOpen,setmodalOpen]=useState(false)
  
  return (
    
    <ChatProvider>
    <BrowserRouter>
    <div className="App">
      <LoginContext.Provider value={{ setuserLogin, setmodalOpen }}>
      <Navbar login={userLogin} />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/signin' element={<Signin />}></Route>
        <Route exact path='/profile' element={<Profile />}></Route>
        <Route path='/createpost' element={<Createpost />}></Route>
        <Route path='/profile/:userid' element={<UserProfile />}></Route>
        <Route path='/followingpost' element={<Myfollowingpost />}></Route>
        <Route path='/chats' element={<Chat />}></Route>
        
        
      </Routes>
      <ToastContainer theme='dark' />
      {modalOpen && <Modal setmodalOpen={setmodalOpen}/>}
      
      </LoginContext.Provider>
    </div>
   

    </BrowserRouter>
    </ChatProvider>

  );
}

export default App;
