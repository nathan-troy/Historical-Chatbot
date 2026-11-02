import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Speak." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // User message
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");

    // Placeholder bot response (to be replaced by the actual logic)
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        sender: "bot", 
        text: `The Emperor acknowledges: "${currentInput}"` 
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Speak to Emperor Norton</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="input-area">
        <input
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
