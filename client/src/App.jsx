// src/App.jsx

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Update if different

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(SOCKET_SERVER_URL);

    // Listen for incoming messages
    socketRef.current.on("chat message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    // Emit message to server
    socketRef.current.emit("chat message", {
      text: input,
      timestamp: new Date().toISOString(),
      sender: "User", // You can replace with actual username
    });

    setInput("");
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Socket.io Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 300,
          overflowY: "scroll",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <strong>{msg.sender}</strong>: {msg.text}
            <div style={{ fontSize: "0.8em", color: "#666" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", padding: 8, fontSize: 16 }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "8px 16px", fontSize: 16 }}
      >
        Send
      </button>
    </div>
  );
}
