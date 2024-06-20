import React from 'react';

export default function Chatlist ({ chats, setSelectedChat }){
  return (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {chats.map((chat) => (
          <li key={chat._id} style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setSelectedChat(chat)} 
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1.5px solid #ccc', 
                borderRadius: '5px', 
                backgroundColor: '#f5f5f5', 
                cursor: 'pointer' 
              }}
            >
              {chat.chatName || chat.users.map(user => user.name).join(', ')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


