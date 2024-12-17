import React, { useState } from "react";

// Tạo context cho chatbot
export const chatbotContext = React.createContext();

const ChatContext = ({ children }) => {
  // Nhận children từ props
  const [currentStep, setStep] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [selectedMenuFromAI, setSelectedMenuFromAI] = useState(null); // Thêm state cho selectedMenuFromAI

  return (
    <chatbotContext.Provider
      value={{
        currentStep,
        setStep,
        data,
        setData,
        selectedMenuFromAI, // Cung cấp selectedMenuFromAI cho các component khác
        setSelectedMenuFromAI, // Phương thức để cập nhật selectedMenuFromAI
      }}
    >
      {children} {/* Truyền children vào */}
    </chatbotContext.Provider>
  );
};

export default ChatContext;
