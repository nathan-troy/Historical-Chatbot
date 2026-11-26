import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Avatar from "./components/Profile_pic.jsx";
import profilePic from "./assets/Norton_profile_pic.jpg";
import Navbar from "./navbar.jsx";
import Settings from "./pages/Settings.jsx";

const DEFAULT_SETTINGS = {
  darkMode: false,
  voiceNarration: false,
  voiceVolume: 1,
  textScale: "normal",
  titleRank: "",
  titleDomain: ""
};

export default function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("norton_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Contains the history of the convo as an array of msg objects
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Speak." }
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nortonDollars, setNortonDollars] = useState(0);
  const [imperialFavour, setImperialFavour] = useState(50); // currently, i've just set it to 50 by default
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isBanished, setIsBanished] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("norton_settings", JSON.stringify(settings));
    document.body.classList.toggle("dark-mode", settings.darkMode);
    document.documentElement.setAttribute("data-text-scale", settings.textScale);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Check whether the Express backend is running
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:5000/");
        setIsServerOnline(res.ok);
      } catch {
        setIsServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

   const speakReply = (text) => {
  if (!settings.voiceNarration || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.92; // slightly deeper tone
  utterance.volume = settings.voiceVolume ?? 1;
  window.speechSynthesis.speak(utterance);
};



  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIsNameSet(true);
    inputRef.current?.focus();
  };

  const displayName = userName.trim() || "Citizen";
  const courtTitle = 
    settings.titleRank && settings.titleDomain
    ? `${settings.titleRank} ${settings.titleDomain}`
    : settings.titleRank || "";
  const titledSpeaker = courtTitle ? `${courtTitle} ${displayName}` : displayName;

  const getEmperorMood = () => {
    if (isBanished || imperialFavour <= 0) return "Banished";
    if (imperialFavour >= 80) return "Delighted";
    if (imperialFavour >= 50) return "Pleased";
    if (imperialFavour >= 25) return "Indifferent";
    return "Displeased";
  };

  const handleBuyPardon = () => {
    if (nortonDollars < 30) return;
    setNortonDollars((prev) => prev - 30);
    setImperialFavour(35);
    setIsBanished(false);
    const pardonText =
      "Your $30 tribute is accepted into the Royal Treasury. By Imperial Grace, your banishment is lifted—tread carefully!";
    setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: pardonText }]);
    speakReply(pardonText);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || isTyping) return;

    if (!isNameSet && userName.trim()) {
      setIsNameSet(true);
    }

    const currentInput = input;
    const currentSpeaker = displayName;
    const nextDollars = nortonDollars + 10;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: currentInput
    };

    setMessages((prev) => [...prev, userMessage]);
    setNortonDollars(nextDollars);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: currentInput,
          userName: currentSpeaker,
          courtTitle: courtTitle,
          imperialFavour: imperialFavour,
          nortonDollars: nextDollars
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setIsServerOnline(true);
      const data = await response.json();

      // display the actual backend response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.reply
        }
      ]);

      speakReply(data.reply);

      // update Imperial favour
      if (data.imperialFavour !== undefined) {
        setImperialFavour(data.imperialFavour);
      }
      if (data.nortonDollars !== undefined) {
        setNortonDollars(data.nortonDollars);
      }
      if (data.banished !== undefined) {
        setIsBanished(data.banished);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsServerOnline(false);

      const offlineText = "I beg your pardon? try again"; // if you're seeing this, it's likely you're forgetting to start the backend
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: offlineText
        }
      ]);
      speakReply(offlineText);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), sender: "bot", text: "Speak." }]);
    setNortonDollars(0);
    setImperialFavour(50);
    setIsBanished(false);
    inputRef.current?.focus();
  };

  const statusText = !isServerOnline ? "Offline" : isBanished ? "Banished" : "In Court";
  const statusClass = !isServerOnline
    ? "status-offline"
    : isBanished
    ? "status-banished"
    : "status-online";

  const chatPage = (
    <>
      <header className="chat-header">
        <div className="header-title-group">
          <h1>Speak to Emperor Norton</h1>
          <span className={`court-status ${statusClass}`}>
            <span className="status-dot" /> {statusText}
          </span>
        </div>
        <button onClick={handleClear} className="clear-btn" title="Reset Chat">
          Reset
        </button>
      </header>

      <div className="stats-bar">
        {/* points display */}
        <div className="dollars-display">
          <strong>Norton Dollars:</strong> ${nortonDollars}
        </div>

        <div className="favour-display">
          <span>
            <strong>Imperial Favour:</strong> {getEmperorMood()} ({imperialFavour}%)
          </span>
          {/* outline of the bar */}
          <div className="favour-bar-track">
            {/* interior of the bar */}
            <div
              className="favour-bar-fill"
              style={{ width: `${imperialFavour}%` }}
            />
          </div>
        </div>
      </div>

      {!isNameSet ? (
        <form onSubmit={handleNameSubmit} className="name-bar">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="State your name, Citizen..."
            maxLength={24}
          />
          <button type="submit">Declare</button>
        </form>
      ) : (
        <div className="name-status">
          <span>
            Speaking as: <strong>{titledSpeaker}</strong>
          </span>
          <button onClick={() => setIsNameSet(false)} className="edit-name-btn">
            Change
          </button>
        </div>
      )}

      {/* Main chat area */}
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            {/* rendering Norton's profile picture beside each bot message, for that messaging app aesthetic */}
            {msg.sender === "bot" && (
              <div className="msg-avatar">
                <Avatar src={profilePic} />
              </div>
            )}
            <div className="message-group">
              <span className="sender-tag">
                {msg.sender === "bot" ? "Emperor Norton I" : titledSpeaker}
              </span>
              <div className="message-bubble">{msg.text}</div>
            </div>
          </div>
        ))}

        {/* '...' as norton types */}
        {isTyping && (
          <div className="message-row bot">
            <div className="msg-avatar">
              <Avatar src={profilePic} />
            </div>
            <div className="message-group">
              <span className="sender-tag">Emperor Norton I</span>
              <div className="message-bubble typing-bubble">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* bottom text input and the send button (disabled when the bot is typing) */}
      <form onSubmit={handleSend} className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isBanished
              ? "Banished! Pay $30 for a Pardon or click Reset..."
              : "Speak to Norton..."
          }
          disabled={isTyping || isBanished}
        />
        {isBanished && nortonDollars >= 30 ? (
          <button type="button" onClick={handleBuyPardon}>
            Pardon ($30)
          </button>
        ) : (
          <button type="submit" disabled={isTyping || isBanished}>
            Send
          </button>
        )}
      </form>
    </>
  );

  return (
    <div className="main_container">
      <div className="chat-container">
        <Navbar />
        <Routes>
          <Route path="/" element={chatPage} />
          <Route
            path="/settings"
            element={
              <Settings
                settings={settings}
                updateSetting={updateSetting}
                messages={messages}
                onClearChat={handleClear}
              />
            }
          />
          <Route
            path="/about"
            element={
              <div style={{ padding: "20px" }}>
                <h2>Imperial Proclamation</h2>
                <p>
                  From Eureka Lodgings, 624 Commercial Street: Know all Citizens that His
                  Imperial Majesty Norton I, Emperor of these United States and Protector of
                  Mexico, holds daily court to hear petitions and safeguard San Francisco.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
