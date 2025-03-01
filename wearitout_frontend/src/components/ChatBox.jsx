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
  const API_KEY = `${process.env.REACT_APP_OPENAI_API_KEY}`;
  const [messages, setMessages] = useState([
    {
      message: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sentTime: "just now",
      sender: "Gemini"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  let lastRequestTime = 0;

  const handleSend = async (message) => {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      console.log("Please wait before sending another request.");
      return;
    }

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    const geminiResponse = await processMessageToGemini(newMessages);
    setMessages(geminiResponse);
    setIsTyping(false);

    lastRequestTime = currentTime;
  };

  async function processMessageToGemini(chatMessages) {
    const userMessage = chatMessages[chatMessages.length - 1].message;

    const apiRequestBody = {
      contents: [{
        parts: [{ text: userMessage }]
      }]
    };

    try {
      const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiRequestBody),
          }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("HTTP error:", response.status, error);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0].content.parts.length > 0) {
        return [
          ...chatMessages,
          {
            message: data.candidates[0].content.parts[0].text,
            sender: "Gemini",
          },
        ];
      } else {
        console.error("Gemini response invalid:", data);
        return chatMessages;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return chatMessages;
    }
  }

  return (
      <Root>
        <ChatBoxContainer>
          <MainContainer>
            <ChatContainer>
              <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={isTyping ? <TypingIndicator content="Gemini is typing..." /> : null}
              >
                {messages.map((message, i) => (
                    <Message
                        key={i}
                        model={{
                          ...message,
                          direction: message.sender === "user" ? "outgoing" : "incoming",
                          position: "single"
                        }}
                        className={message.sender === "user" ? "user-message" : "bot-message"}
                    />
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
