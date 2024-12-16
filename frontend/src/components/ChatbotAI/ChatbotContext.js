import React, { useState } from "react";
import ChatBotContainer from "./ChatbotAI";
export const chatbotContext = React.createContext();
const ChatContext = () => {
  const [currentStep, setStep] = React.useState(1);
  const [data, setData] = React.useState([]);
  return (
    <div>
      <chatbotContext.Provider
        value={{
          currentStep,
          setStep,
          data,
          setData,
        }}
      >
        <ChatBotContainer />
      </chatbotContext.Provider>
    </div>
  );
};

export default ChatContext;
