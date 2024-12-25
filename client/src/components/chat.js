import React,{useState ,useEffect} from 'react'
import { ChatState } from '../context/chatprovider'
// import Sidedrawer from './sidedrawer';
// import { Box } from '@chakra-ui/react';
// import Mychats from './mychats';
import Chatbox from './chatbox';
import io from "socket.io-client";

import Chatlist from './chatlist';
import "./chats.css"
const endpoint = process.env.REACT_APP_BASE_URL;
var socket ,selectedChatCompare;
export default function Chat() {
    const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketConnected,setsocketConnected]=useState(false);
  useEffect(() => {
    fetchChats();
  }, []);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchchats`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching chats');
    }
  };


  
    const searchUsers = () => {
        const query = new URLSearchParams({ search: searchTerm }).toString();
        fetch(`${process.env.REACT_APP_BASE_URL}/user?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => {
            setUsers(data);
            setError('');
          })
          .catch((error) => {
            console.error(error);
            setError('An error occurred while searching for users');
            setUsers([]);
          });
      };
      const accessChat = async (userId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/accesschat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ userId })
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setSelectedChat(data);
          fetchChats(); 
        } catch (error) {
          console.error(error);
          setError('An error occurred while accessing chat');
        }
      };
      const fetchMessages = async (chatId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/allmessages/${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
          });
          if (!response.ok) {
            throw new Error('Network  issue ');
          }
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error(error);
          setError('An error occurred while fetching');
        }
      };
      const sendMessage = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/sendmessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
              content: messageContent,
              chatid: selectedChat._id
            })
          });
          if (!response.ok) {
            throw new Error('Network issue');
          }
          const data = await response.json();
          console.log('Message sent:', data);
          setMessages([...messages, data]); 
      setMessageContent(''); 
          
          fetchMessages(selectedChat._id); 
          setMessageContent(''); 
        } catch (error) {
          console.error('Error sending message:', error);
          setError('An error occurred while sending message');
        }
    }
    useEffect(()=>{
        socket=io(endpoint);
        socket.emit("setup",user)
        socket.on("connection",()=>{
setsocketConnected(true);
        })
    },[])
    
const {user } =ChatState;
  return (
    // <div style={{width:"100%"}}>
        
    //     <Sidedrawer />
    //     <Box
    //     d='flex'
    //     justifyContent="space-between"
    //     w="100%"
    //     h="92vh"
    //     p="12px">
    //         {user&&<Mychats/>}
    //         {user&&<Chatbox />}
    //     </Box>
    // </div>
    <div className='chatcontainer'>
       <div className='chats'> <div className='search'>
            <input type="text" placeholder='search for users' id="inputbox" value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
        <hr/>
          <button className='btn' onClick={searchUsers}>Search</button>
            
            </div>
        </div>
        <div id='results'>
        {error && <p>{error}</p>}
        {users.length === 0 && !error ? (
          <p>No users found</p>
        ) : (
          users.map((user) => (
            <div key={user._id}>
              <p>{user.name}</p>
              <button onClick={() => accessChat(user._id)}>Chat</button>
            </div>
          ))
        )}
      </div>
      <div className='chatlist'>
        <Chatlist chats={chats} setSelectedChat={setSelectedChat} />
      </div>
      <div className='chatbox'>
      {selectedChat ? (
          <>
            <Chatbox chat={selectedChat} messages={messages} />
            <div className='message-input'>
              <textarea
                rows="4"
                cols="50"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a chat to start messaging</p>
        )}
      </div>
    
    </div>
  )
}
