import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { getAllMessagesRoute, sendMessageRoute } from "../utls/APIRoutes";
import {v4 as uuidv4} from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const fetchMessages = () => {
    axios.post(getAllMessagesRoute, {
      from: currentUser._id,
      to: currentUser._id,
    })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
        // Handle error, such as displaying an error message to the user
      });
  };

  // Fetch messages when component mounts or when currentChat changes
  useEffect(() => {
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages]
    console.log("msg====", msg)
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg })
      });
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    console.log("arrivalMessage", arrivalMessage)
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  },[messages])
  

  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{currentChat?.username}</h3>
                </div>
              </div>
              <Logout />
            </div>
            {/* <Messages /> */}
            <div className="chat-messages">
              {
                messages?.map((messages) => {
                  let dateTime;

                  if (messages?.updatedAt) {
                    dateTime = new Date(messages.updatedAt);
                  } else {
                    dateTime = new Date(); // Current date and time
                  }

                  const formattedDate = dateTime.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                
                  const formattedTime = dateTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div className={`message ${messages.fromSelf ? "sended" : "recieved"}`}>
                        <div className="content">
                          <div><span style={{marginRight:"5px"}}>@{messages.senderName ?? currentChat?.username},</span><span> {messages.message}</span></div>
                          <div style={{textAlign:"right", fontSize:"10px", position:"relative", top:"8px"}}>
                          {formattedDate}, {formattedTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        )}
    </>
  )
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}
`;
export default ChatContainer