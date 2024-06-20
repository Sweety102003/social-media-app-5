import React from 'react';

export default function Chatbox({ chat, messages }) {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>{chat.chatName}</h2>
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message._id}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            <strong>{message.sender.name}:</strong> {message.content}
          </div>
        ))
      ) : (
        <p>you havent  message in this chat.</p>
      )}
    </div>
  );
}
