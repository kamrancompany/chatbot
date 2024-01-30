import React, { useState } from "react";
import axios from "axios";
import   "../style/AiBot.css";
import SendIcon from "@mui/icons-material/Send";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  // const applyColorAndRemoveStars = (text) => {
  //   const bulletRegex = /^\* (.+)$/gm;
  //   const backtickRegex = /`(.*?)`/g;
  //   const boldRegex = /\**(.*?)\**/g;
  //   const digitRegex = /\b(\d+)\b/g;
  
  //   let bulletNumber = 0;
  
  //   return text.split('\n').map((line, index) => {
  //     const bulletMatch = bulletRegex.exec(line);
  
  //     if (bulletMatch) {
  //       bulletNumber++;
  
  //       const bulletContent = bulletMatch[1];
  
  //       return (
  //         <p key={index}>
  //           <span style={{ color: 'green' }}>{`${bulletNumber}.`}</span>
  //           {' '}
  //           {bulletContent.split(digitRegex).map((part, partIndex) => (
  //             part.match(/^\d+$/) ? (
  //               <span key={partIndex} style={{ color: 'yellow' }}>{part}</span>
  //             ) : (
  //               <span key={partIndex}>{part}</span>
  //             )
  //           ))}
  //         </p>
  //       );
  //     } else {
  //       let lastIndex = 0;
  //       const components = [];
  //       let match;
  
  //       while ((match = boldRegex.exec(line)) !== null) {
  //         components.push(
  //           line.substring(lastIndex, match.index),
  //           <span key={components.length} style={{ color: '#cd5c5c' }}>{match[1]}</span>
  //         );
  //         lastIndex = match.index + match[0].length;
  //       }
  
  //       components.push(line.substring(lastIndex));
  
  //       while ((match = backtickRegex.exec(line)) !== null) {
  //         components.push(
  //           line.substring(lastIndex, match.index),
  //           <span key={components.length} style={{ color: 'blue' }}>{match[1]}</span>
  //         );
  //         lastIndex = match.index + match[0].length;
  //       }
  
  //       components.push(line.substring(lastIndex));
  
  //       return <p key={index}>{components}</p>;
  //     }
  //   });
  // };
   
  
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
            position:"relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <div className="animated-loading-search" style={{ display: "flex" }}>
              <span data-index="1">
              </span>
              <span data-index="2">
              </span>
              <span data-index="3">
              </span>
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
                 <p style={{ padding: "5px", whiteSpace: "break-spaces", position: "relative", height: "60%",textAlign:"justify" }}>
                  {/* {applyColorAndRemoveStars(botResponse)} */}
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
          <button className="bard-click-btn" onClick={handleSendMessage} >
            <SendIcon className="send-btn" />
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
