import React, { useState, useRef, useEffect } from 'react';
import './App.css';  // Your custom CSS file

const BACKEND_URL = "https://georgo-chat-backend.vercel.app/api/chat";

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Refs for audio elements
  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);

 useEffect(() => {
  const container = messagesEndRef.current?.parentElement;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages]);


  const sendMessage = async () => {
    if (!message.trim()) return;

    // Play send sound
    sendSoundRef.current?.play();

    const userMessage = { sender: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();

      // Play receive sound
      receiveSoundRef.current?.play();

      const aiMessage = { sender: 'ai', text: data.reply || 'No reply.' };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage = { sender: 'ai', text: '❌ Error contacting server.' };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Audio elements for sounds */}
      <audio ref={sendSoundRef} src="/sounds/send.mp3" preload="auto" />
      <audio ref={receiveSoundRef} src="/sounds/receive.mp3" preload="auto" />

      {/* Header with logo */}
      <header className="app-header">
        <img
          src="/logo.png"
          alt="Georgo Chat Logo"
          className="app-logo"
          onClick={() => alert('Hello from Georgo Chat!')}
          title="Click me!"
        />
        <h1 className="app-title">Georgo Chat</h1>
      </header>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="message-bubble ai loading">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input and Send Button */}
        <textarea
          className="input-box"
          placeholder="Type your message here..."
          rows="2"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={loading || !message.trim()}
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        Powered by <strong>Georgo</strong> &nbsp;
        <img src="/logo.png" alt="Georgo Logo" className="footer-logo" />
      </footer>
    </div>
  );
}

export default App;