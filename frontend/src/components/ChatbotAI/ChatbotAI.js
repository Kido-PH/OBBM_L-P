import React, { useState } from "react";
import { FiSend } from "react-icons/fi"; // Import icon gửi đi
import { TextField, IconButton, Box, Button } from "@mui/material";
import { chatbotContext } from "./ChatbotContext";
import ChatResponse from "./ChatResponse";
import ChatRequest from "./ChatRequest";
import eventApi from "api/eventApi";
import { useNavigate } from "react-router-dom";
import { checkAccessToken } from "services/checkAccessToken";

const ChatBotContainer = () => {
  const navigate = useNavigate();

  const { currentStep, setStep } = React.useContext(chatbotContext);
  const [buttonsVisible, setButtonsVisible] = useState(1);
  const [nextStep, setNextStep] = useState(null); // Điều khiển bước tiếp theo của bot
  const [costNguoiDung, setCostNguoiDung] = useState(0); // Điều khiển bước tiếp theo của bot
  const [currentEventInfo, setCurrentEventInfo] = React.useState(null);

  const fetchEvent = async () => {
    const currentEventId = JSON.parse(localStorage.getItem("currentEventId"));
    try {
      const currentEvent = await eventApi.get(currentEventId);
      setCurrentEventInfo(currentEvent.result);
    } catch (error) {
      checkAccessToken(navigate);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 trong các lựa chọn
  const handleChoice = (choice, cost) => {
    setStep(currentStep + 1);
    if (choice === "change_event") {
      setNextStep("change_event");
    } else if (choice === "back_to_start_menu") {
      setStep(currentStep);
      setNextStep("start_menu");
    } else if (choice === "start_menu") {
      setNextStep("start_menu");
    } else if (choice === "create_menu") {
      setNextStep("create_menu");
      setCostNguoiDung(cost);
    }
  };

  React.useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <div
      style={{
        height: "100%", // Fixed total height for the chatbox
      }}
    >
      {/* Chat History (scrollable area) */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          height: "430px",
        }}
      >
        {currentStep >= 1 && (
          <>
            <ChatResponse step={1} eventName={currentEventInfo?.name} />{" "}
            {/* Đoạn chào mừng ban đầu */}
            {/* Hiển thị các lựa chọn ban đầu */}
          </>
        )}

        {((currentStep >= 2 && nextStep === "change_event") ||
          (currentStep >= 3 && nextStep === "start_menu")) && (
          <>
            <ChatRequest step={2} content="change_event" />
            <ChatResponse step={2} content="change_event" />
          </>
        )}

        {((currentStep >= 2 && nextStep === "start_menu") ||
          currentStep >= 3) && (
          <>
            <ChatRequest step={2} content="start_menu" />
            <ChatResponse step={2} content="start_menu" />
          </>
        )}

        {currentStep >= 3 && nextStep === "create_menu" && (
          <>
            <ChatRequest
              step={3}
              content="create_menu"
              costNguoiDung={costNguoiDung}
            />
            <ChatResponse step={3} content="create_menu" />
          </>
        )}
      </Box>

      {/* Input Area (fixed at the bottom) */}
      {currentStep === 1 && (
        <div className="mb-3">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("change_event")}
            sx={{ marginLeft: "12px", fontSize: "12px" }}
          >
            Tôi muốn đổi sự kiện tiệc
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("start_menu")}
            sx={{ marginLeft: "8px", fontSize: "12px" }}
          >
            Bắt đầu tạo thực đơn
          </Button>
        </div>
      )}

      {currentStep === 2 && nextStep === "change_event" && (
        <div className="mb-3">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("back_to_start_menu")}
            sx={{ marginLeft: "8px", fontSize: "12px" }}
          >
            Bắt đầu tạo thực đơn
          </Button>
        </div>
      )}

      {currentStep === 2 && nextStep === "start_menu" && (
        <div className="mb-3">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("create_menu", 100000)}
            sx={{ marginLeft: "12px", fontSize: "12px" }}
          >
            100.000/người
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("create_menu", 120000)}
            sx={{ marginLeft: "8px", fontSize: "12px" }}
          >
            120.000/người
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("create_menu", 180000)}
            sx={{ marginLeft: "8px", fontSize: "12px" }}
          >
            180.000/người
          </Button>
        </div>
      )}
      <Box
        sx={{
          position: "relative",
          bottom: "0px",
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Nhập tin nhắn..."
          fullWidth
          sx={{
            marginRight: "8px",
          }}
        />
        <IconButton color="primary" aria-label="send message">
          <FiSend />
        </IconButton>
      </Box>
    </div>
  );
};

export default ChatBotContainer;
