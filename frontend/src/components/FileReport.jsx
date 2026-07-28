import React, { useState } from "react";
import API_BASE_URL from "../config/api";

const FileReport = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Namaste! Main Nyay Sahayak Police Officer hun. Main aapki FIR file karne mein madad karunga. Kya hua hai aapke saath? (Chori, Maar-peet, Fraud, etc.)" }
  ]);
  const [history, setHistory] = useState(""); // History maintain kar rahe hain
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. User ka message screen pe dikhao
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 2. Backend ko bhejo (User input + Purani History)
      const response = await fetch(`${API_BASE_URL}/file-report-interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: input,
          history: history // Yeh zaroori hai taaki AI ko pichli baat yaad rahe
        }),
      });

      const data = await response.json();

      // 3. AI ka jawab screen pe dikhao
      setMessages([...newMessages, { sender: "ai", text: data.answer }]);

      // 4. History update karo (User Input + AI Response add karke)
      const newHistory = `${history}\nUser: ${input}\nAI: ${data.answer}`;
      setHistory(newHistory);

    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { sender: "ai", text: "Sorry, connection error. Try again." }]);
    }

    setLoading(false);
    setInput(""); // Input box khali karo
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", border: "1px solid #ccc", padding: "20px", borderRadius: "10px" }}>
      <h2>👮 File FIR (Interactive Mode)</h2>

      {/* Chat Area */}
      <div style={{ height: "400px", overflowY: "scroll", marginBottom: "20px", background: "#f9f9f9", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "10px 0" }}>
            <span style={{
              background: msg.sender === "user" ? "#007bff" : "#e0e0e0",
              color: msg.sender === "user" ? "#fff" : "#000",
              padding: "8px 15px",
              borderRadius: "15px",
              display: "inline-block",
              maxWidth: "80%"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p style={{ fontStyle: "italic" }}>Officer likh rahe hain...</p>}
      </div>

      {/* Input Area */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Yahan type karein..."
          style={{ flex: 1, padding: "10px" }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px", background: "green", color: "white", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default FileReport;