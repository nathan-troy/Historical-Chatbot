import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  // Contains the history of the convo as an array of msg objects
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Speak." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // User message
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Placeholder bot response (to be replaced by the actual logic)
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        sender: "bot", 
        text: `The Emperor acknowledges: "${currentInput}"` 
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000); //simulated delay (1000ms) before response
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), sender: "bot", text: "Speak."}]);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Speak to Emperor Norton</h1>
        <button onClick={handleClear} className="clear-btn" title="Reset Chat">Reset</button>
      </header>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        {/* '...' as norton types */}
        {isTyping && (
          <div className="message-row bot">
            <div className="message-bubble typing-bubble">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}


        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to Norton..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}


