import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components"
import { allUsersRoute, host } from '../utls/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client"

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setcontacts] = useState([])
  const [currentUser, setcurrentUser] = useState(undefined)
  const [currentChat, setcurrentChat] = useState(undefined)
  const [isLoaded, setisLoaded] = useState(false)

console.log("currentUser 333===", currentUser)
  useEffect( () => {
    const fetchData = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setcurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setisLoaded(true)
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser])
  
  useEffect( () => {
    if (currentUser) {
      // if (currentUser.isAvatarImageSet) {
      //   const data = axios.get(`${allUsersRoute}/${currentUser._id}`);
      //   console.log("data====", data.data)
      //   setcontacts(data.data);
      // } else {
      //   navigate("/setAvatar");
      // }
      if (currentUser.isAvatarImageSet) {
        axios.get(`${allUsersRoute}/${currentUser._id}`)
          .then(response => {
            console.log("data====", response.data);
            setcontacts(response.data);
          })
          .catch(error => {
            // Handle error
            console.error("Error fetching data:", error);
          });
      } else {
        navigate("/setAvatar");
      }
      
    }
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setcurrentChat(chat)
  }

  return (
    <Container>
      <div className='container'>
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        {isLoaded && currentChat === undefined ?
        <Welcome currentUser={currentUser}/>
        :
        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }
      </div>
    </Container>
  )
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat