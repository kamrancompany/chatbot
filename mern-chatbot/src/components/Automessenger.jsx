import React, { useState, useRef, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../style/Automessenger.css";
import cloneDeep from "lodash/cloneDeepWith";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import bot from "../assets/chatbotImages/bot_images.png";
import bot1 from "../assets/chatbotImages/bot_img.png";
import you from "../assets/chatbotImages/you.png";
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";
import Swal from "sweetalert2";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Automessenger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // const [dataHistory, setDataHistory] = useState([])
  const [userData, setUserData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryContainerRef = useRef(null);
  const userID = localStorage.getItem("userId");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/users/${userID}`
          );
          setUserData(response.data.User);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, 3000);
  }, []);
  useEffect(() => {
    if (chatHistoryContainerRef.current && userData) {
      chatHistoryContainerRef.current.scrollTop =
        chatHistoryContainerRef.current.scrollHeight;
    }
    if (chatHistoryContainerRef.current && chatHistory) {
      chatHistoryContainerRef.current.scrollTop =
        chatHistoryContainerRef.current.scrollHeight;
    }
  }, [userData, searchHistory]);
  const handleSendMessageBtn = async (userInput, event) => {
    try {
      if (event) {
        // Access event properties if needed
        console.log("Event type:", event.type);
      }
  
      if (event && (event.key === "Enter" || event.type === "click")) {
        setIsLoading(true);
  
        setSearchHistory([...searchHistory, { question: userInput, answer: botResponse }]);
        setUserInput("");
  
        const response = await axios.get(
          `http://localhost:8000/api/messages/${userInput}`,
          {
            params: { userInput: [userInput.trim()] },
          }
        );
  
        const chatResult = response.data;
  
        if (chatResult && chatResult.Bot) {
          const updatedSearchHistory = [
            {
              question: userInput,
              answer: chatResult.Bot,
            },
          ];
  
          setSearchHistory((prevSearchHistory) =>
            prevSearchHistory.slice(0, -1).concat({
              question: userInput,
              answer: chatResult.Bot,
            })
          );
  
          setChatHistory([...chatHistory, chatResult]);
          setBotResponse(chatResult.Bot);
  
          if (userID) {
            const response = await axios({
              method: "put",
              url: `http://localhost:8000/users/${userID}`,
              headers: {
                "Content-Type": "application/json",
              },
              data: {
                searchHistory: modifyCircularReferences(updatedSearchHistory),
              },
            });
  
            console.log("Modified Search History from server:", updatedSearchHistory);
          } else {
            console.error("User ID not found in local storage");
          }
        } else {
          console.error("Invalid or missing 'Bot' property in chatResult:", chatResult);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (event) => {
   
    if (event.key === "Enter" || event.type === "click") {
      try {
        setIsLoading(true);
        setSearchHistory([
          ...searchHistory,
          { question: userInput, answer: botResponse },
        ]);
        setUserInput("");
        const response = await axios.get(
          `http://localhost:8000/api/messages/${userInput}`,
          {
            params: { userInput: [userInput.trim()] },
          }
        );

        const chatResult = response.data;

        if (chatResult && chatResult.Bot) {
          const updatedSearchHistory = [
            {
              question: userInput,
              answer: chatResult.Bot,
            },
          ];

          setSearchHistory((prevSearchHistory) =>
            prevSearchHistory.slice(0, -1).concat({
              question: userInput,
              answer: chatResult.Bot,
            })
          );
          setChatHistory([...chatHistory, chatResult]);
          setBotResponse(chatResult.Bot);

          if (userID) {
            const response = await axios({
              method: "put",
              url: `http://localhost:8000/users/${userID}`,
              headers: {
                "Content-Type": "application/json",
              },
              data: {
                searchHistory: modifyCircularReferences(updatedSearchHistory),
              },
            });

            console.log(
              "Modified Search History from server:",
              updatedSearchHistory
            );
          } else {
            console.error("User ID not found in local storage");
          }
        } else {
          console.error(
            "Invalid or missing 'Bot' property in chatResult:",
            chatResult
          );
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    if (
      userData &&
      Array.isArray(userData.data) &&
      userData.data.length === 0
    ) {
      setTimeout(() => {
        setSearchHistory([
          {
            question: "",
            answer: (
              <h5 style={{ textTransform: "uppercase", color: "#6F00FF",fontSize:"1rem" }}>
                Welcome to our Real State Agency!
              </h5>
            ),
          },
        ]);
      });

      setTimeout(() => {
        setSearchHistory((prevSearchHistory) => [
          ...prevSearchHistory,
          {
            question: "",
            answer: (
              <h5 style={{ textTransform: "uppercase", color: "#6F00FF",fontSize:"1rem" }}>
                How can I assist you today?
              </h5>
            ),
          },
        ]);
      }, 2000);

      setTimeout(() => {
        setSearchHistory((prevSearchHistory) => [
          ...prevSearchHistory,
          {
            question: "",
            answer: (
              <>
                <h5 style={{ textTransform: "uppercase", color: "#6F00FF",fontSize:"1rem" }}>
                  We are offer these Services
                </h5>
                {/* <p>1) Buy a property</p> */}
                <button className="menu-btns"
                  onClick={(event) =>
                    handleSendMessageBtn("buy a property", event)
                  }
                >
                  buy a property
                </button>
                {/* <p>2) Sell a property</p> */}
                <button className="menu-btns"
                  onClick={(event) =>
                    handleSendMessageBtn("Sell a property", event)
                  }
                >
                  Sell a property
                </button>
                <button className="menu-btns"
                  onClick={(event) =>
                    handleSendMessageBtn("Rent a property", event)
                  }
                >
                  Rent a property
                </button>
                
              </>
            ),
          },
        ]);
      }, 3000);
    }
  }, [userData]);
  const modifyCircularReferences = (obj) => {
    const seen = new WeakSet();
    const modifiedObj = JSON.parse(
      JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return null; // or any other placeholder value
          }
          seen.add(value);
        }
        return value;
      })
    );

    return modifiedObj;
  };
  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };
  const ClearChats = async () => {
    console.log("clear Chats");
    try {
      const response = await axios.delete(
        `http://localhost:8000/users/userhistory/${userID}`,
        {
          data: searchHistory,
        }
      );

      console.log("Clear Chats SuccessFully", response);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The message has been deleted.",
        }).then(() => {
          // Reload the page after showing the success message
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the message.",
      });
    }
  };
  const confirmClearChats = () => {
    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Do You Really want to clear Chats?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        ClearChats();
      }
    });
  };
  return (
    <>
      <div className="full-content-div">
        <div className="main-chat-div">
          <div className="chatbot-head">
            <h4 className="profile_text">
              <img src={bot} className="bot-img" />
            </h4>
            <div className="bot-header-content">
              <h4>1011 ChatBot</h4>
              <h5 className="top-para">This is Customize chatbot.</h5>
            </div>
            <span className="toggle-button-dots" onClick={toggleModal}>
              <MoreVertIcon
                style={{ height: "3rem", width: "3rem" }}
                className="three-dots"
              />
            </span>
            {isModalOpen && (
              <div className="modal-box modal-box-content">
                <div className="modal-box-child">
                  <div className="toggle-content">
                    <button className="toggle-btn-cross" onClick={toggleModal}>
                      <CloseIcon />
                      Close
                    </button>
                  </div>
                  <div className="toggle-content">
                    <Link to="/" className="bot-header-link">
                      Bard Ai
                    </Link>
                  </div>
                  <div className="toggle-content">
                    <button
                      className="toggle-content-btn bot-header-link"
                      onClick={() => confirmClearChats()}
                    >
                      Clear Chats
                    </button>
                  </div>
                  <div className="toggle-content">
                    <Link
                      className="bot-header-link"
                      onClick={logout}
                      to="/signin"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bot_response_div" ref={chatHistoryContainerRef}>
            <div>
              {userData ? (
                <div>
                  {userData.data && Array.isArray(userData.data) ? (
                    <div>
                      <ol style={{ marginLeft: "-3rem" }}>
                        {userData.data.map((item, index) => (
                          <li key={index} style={{ listStyle: "none" }}>
                            <div className="question-parent-div">
                              <span className="bot_questions">
                                {item.question}
                              </span>
                              <span className="bot-que-img-span">
                                <img src={you} className="ques-img-bot" />
                              </span>
                            </div>
                            <div className="main-res-div">
                              <img className="resp-img-bot" src={bot} />
                              <p className="bot_response">
                                <>{item.answer}</>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="loading-spinner">
                      <RingLoader
                        color="#6F00FF"
                        loading={!userData.data}
                        size={100}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="loading-spinner loading-anim-spinner">
                  <RingLoader color="#6F00FF" loading={!userData} size={100} />
                </div>
              )}
            </div>

            {searchHistory.map((item, index) => (
              <div
                style={{ position: "relative" }}
                key={index}
                className="search-item"
              >
                {item.question && (
                  <div className="question-parent-div">
                    <span className="bot_questions">{item.question}</span>
                    <span className="bot-que-img-span">
                      <img src={you} className="ques-img-bot" />
                    </span>
                  </div>
                )}
                <div className="main-res-div">
                  <img src={bot} className="resp-img-bot" />
                  <p className="bot_response">
                    {index === searchHistory.length - 1 && isLoading ? (
                      <div className="animated-loading">
                        <span data-index="1"></span>
                        <span data-index="2"></span>
                        <span data-index="3"></span>
                      </div>
                    ) : (
                      <>{item.answer}</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="search-input-main-div">
            <input
              className="search-input"
              type="text"
              placeholder="Chat with bot"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={userInput ? handleSendMessage : null}
            />
            {userInput && (
              <button onClick={handleSendMessage} className="search-btn">
                <SendIcon className="ui-icon" style={{height:"1.5rem",width:"1rem"}}/>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Automessenger;
