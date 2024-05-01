import React, { useState } from "react";
import axios from "axios";
import "../style/AiBot.css";
import SendIcon from "@mui/icons-material/Send";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSendMessage = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/messages/${userInput}`,
          {
            params: { userInput: [userInput.trim()] },
          }
        );
        const chatResult = response.data;

        setChatHistory([...chatHistory, { role: "user", text: userInput }]);
        setChatHistory([...chatHistory, chatResult]);
        setBotResponse(chatResult.Bot);
        console.log(chatResult.Bot);
        setUserInput("");
      } catch (error) {
        console.error("Error fetching response:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="OuterDiv">
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user" ? "user-message" : "bot-message"
              }
            >
              {message.text}
            </div>
          ))}
        </div>
        <div
          className="bot-response"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <div
              className="animated-loading-search"
              style={{ display: "flex" }}
            >
              <span data-index="1"></span>
              <span data-index="2"></span>
              <span data-index="3"></span>
            </div>
          ) : (
            <>
              {Array.isArray(botResponse) ? (
                <ul>
                  {botResponse.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    padding: "5px",
                    whiteSpace: "break-spaces",
                    position: "relative",
                    height: "60%",
                    textAlign: "justify",
                  }}
                >
                  {botResponse}
                </p>
              )}
            </>
          )}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={userInput ? handleSendMessage : null}
            placeholder="Enter a prompt here..."
          />
          {userInput && (
            <button className="bard-click-btn" onClick={handleSendMessage}>
              <SendIcon className="send-btn" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
