import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ChatBoxContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #fff;
`;

const ChatBox = () => {
  const API_KEY = `${process.env.REACT_APP_OPENAI_API_KEY}`;  // Lấy API_KEY từ biến môi trường

  const [messages, setMessages] = useState([
    {
      message: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };
  
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
  
    // Gọi đúng hàm processMessageToChatGPT
    const chatGPTResponse = await processMessageToChatGPT(newMessages);
    setMessages(chatGPTResponse);
    setIsTyping(false);
  };
  

 // Hàm xử lý message từ ChatGPT
async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });
  
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",  // Đảm bảo bạn đang sử dụng đúng model của ChatGPT
      "messages": [
        { "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience." },
        ...apiMessages
      ]
    };
  
    try {
      let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,  // Đảm bảo API_KEY là đúng
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });
  
      const data = await response.json();
      return [
        ...chatMessages,
        {
          message: data.choices[0].message.content,  // Phản hồi từ ChatGPT
          sender: "ChatGPT"
        }
      ];
    } catch (error) {
      console.error("Error:", error);
      return chatMessages;  // Trả về messages mà không thay đổi nếu có lỗi
    }
  }
  
  return (
    <Root>
      <ChatBoxContainer>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </ChatBoxContainer>
    </Root>
  );
};

export default ChatBox;
