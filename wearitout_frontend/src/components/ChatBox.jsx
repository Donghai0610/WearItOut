import React, { useState } from "react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styled  from 'styled-components';
const Root = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
`;
const Logo = styled.img`
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;

    &:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }

    &.react:hover {
        filter: drop-shadow(0 0 2em #61dafbaa);
    }
`;

const ChatBox = () => {
    const API_KEY = "sk-svcacct-Jdw98zREwmqpD2UizGHR98WcuTS-dgrvR6onyLLRSFDMa4cxP2bpl5LHUjowIUE7T3BlbkFJh5BQ3JNXrB_6Kx3fkj3VBE8lkZvYQTIMmnD0hqeYCZOGsOwWoIBymRIRlaKWn7kA";
    const systemMessage = {
        "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
    };

    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
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
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        };

        const retryDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            let response;
            let attempts = 0;
            // Retry up to 3 times if 429 error occurs
            while (attempts < 3) {
                response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiRequestBody)
                });

                // Kiểm tra lỗi 429
                if (response.status === 429) {
                    console.log("Too many requests. Retrying...");
                    attempts++;
                    await retryDelay(5000); // Wait for 5 seconds before retrying
                    continue;
                }

                if (!response.ok) {
                    throw new Error('API error: ' + response.statusText);
                }

                const data = await response.json();
                return [
                    ...chatMessages,
                    {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT"
                    }
                ];
            }

            // If retry limit reached and still failed, return chatMessages
            console.log("Exceeded retry attempts.");
            return chatMessages;

        } catch (error) {
            console.error("Error:", error);
            return chatMessages;  // Return messages without change if error occurs
        }
    }



    return (
        <Root className="App">
            <div style={{ position: "relative", height: "800px", width: "700px" }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
                        >
                            {messages.map((message, i) => {
                                console.log(message);
                                return <Message key={i} model={message} />
                            })}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </Root>
    );
};

export default ChatBox;
