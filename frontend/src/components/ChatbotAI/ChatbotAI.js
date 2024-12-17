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
  // const ChatBubble = styled(Box)({
  //   maxWidth: "60%",
  //   backgroundColor: "#fff8ec",
  //   borderRadius: "12px",
  //   padding: "10px 16px",
  //   boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  // });

  const { currentStep, setStep } =
    React.useContext(chatbotContext);
  const [nextStep, setNextStep] = useState(null); // Điều khiển bước tiếp theo của bot
  const [costNguoiDung, setCostNguoiDung] = useState(0); // Điều khiển bước tiếp theo của bot
  const [currentEventInfo, setCurrentEventInfo] = React.useState(null);
  const [skipChangeEvent, setSkipChangeEvent] = React.useState(false);
  const [isCostumCost, setIsCostumCost] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorM, setErrorM] = useState(false);

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
      setNextStep("back_to_start_menu");
    } else if (choice === "start_menu") {
      setNextStep("start_menu");
    } else if (choice === "create_menu") {
      setNextStep("create_menu");
      setCostNguoiDung(cost);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    // Tách chuỗi thành các cụm dựa vào khoảng trắng
    const segments = inputValue.split(/\s+/);

    // Tìm cụm đầu tiên có thể parse được thành số nguyên
    const numericValue = segments
      .map((segment) => parseInt(segment, 10)) // Chuyển các cụm thành số nguyên
      .find((num) => !isNaN(num)); // Lấy cụm đầu tiên parse thành công

    // Kiểm tra nếu giá trị tìm thấy thỏa mãn điều kiện
    if (numericValue && numericValue >= 100000 && numericValue <= 500000) {
      setErrorM(false);
      handleChoice("create_menu", numericValue.toString()); // Gửi giá trị hợp lệ
      setInputValue(""); // Reset giá trị input
    } else {
      setErrorM(true); // Đặt trạng thái lỗi nếu không hợp lệ
    }
  };

  // const handleInputChange = (event) => {
  //   const value = event.target.value;
  //   // Chỉ cho phép ký tự số và tối đa 6 ký tự
  //   if (/^\d{0,6}$/.test(value)) {
  //     setInputValue(value);
  //   }
  // };

  React.useEffect(() => {
    fetchEvent();
    setStep(1);
  });

  return (
    <div
      style={{
        height: "100%",
        width: "100%", // Fixed total height for the chatbox
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
          </>
        )}

        {((currentStep >= 2 && nextStep === "change_event") ||
          (currentStep >= 3 && nextStep === "create_menu") ||
          (currentStep >= 2 && nextStep === "back_to_start_menu")) &&
          skipChangeEvent === false && (
            <>
              <ChatRequest step={2} content="change_event" />
              <ChatResponse step={2} content="change_event" />
            </>
          )}

        {((currentStep >= 2 && nextStep === "start_menu") ||
          (currentStep >= 3 && nextStep === "create_menu") ||
          (currentStep >= 2 && nextStep === "back_to_start_menu")) && (
          <>
            <ChatRequest step={2} content="start_menu" />
            <ChatResponse step={2} content="start_menu" />
          </>
        )}

        {errorM === true && (
          <ChatResponse step={3} content="error" costNguoiDung={0} />
        )}

        {currentStep >= 3 && nextStep === "create_menu" && (
          <>
            <ChatRequest
              step={3}
              content="create_menu"
              costNguoiDung={costNguoiDung}
            />
            <ChatResponse
              step={3}
              content="create_menu"
              costNguoiDung={costNguoiDung}
            />
          </>
        )}
      </Box>

      {/* Input Area (fixed at the bottom) */}
      {currentStep === 1 && (
        <div style={{ marginBottom: "6px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("change_event")}
            sx={{ marginLeft: "12px", fontSize: "12px", borderRadius: "20px" }}
          >
            Tôi muốn đổi sự kiện tiệc
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleChoice("start_menu");
              setSkipChangeEvent(true);
            }}
            sx={{ marginLeft: "8px", fontSize: "12px", borderRadius: "20px" }}
          >
            Bắt đầu tạo thực đơn
          </Button>
        </div>
      )}

      {currentStep === 2 && nextStep === "change_event" && (
        <div style={{ marginBottom: "6px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleChoice("back_to_start_menu")}
            sx={{ marginLeft: "8px", fontSize: "12px", borderRadius: "20px" }}
          >
            Bắt đầu tạo thực đơn
          </Button>
        </div>
      )}

      {((currentStep === 2 && nextStep === "start_menu") ||
        (currentStep === 2 && nextStep === "back_to_start_menu")) && (
        <div
          style={{
            marginBottom: "6px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 100000)}
            sx={{
              marginLeft: "12px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            100.000/người
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 120000)}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            120.000/người
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 180000)}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            180.000/người
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 220000)}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            220.000/người
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 250000)}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            250.000/người
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleChoice("create_menu", 300000)}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
              border: 1,
            }}
          >
            300.000/người
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsCostumCost(true);
            }}
            sx={{
              marginLeft: "8px",
              fontSize: "12px",
              borderRadius: "20px",
            }}
          >
            Nhập giá khác
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isCostumCost}
          sx={{
            marginRight: "8px",
          }}
        />
        <IconButton
          color="primary"
          aria-label="send message"
          disabled={!isCostumCost}
          onClick={handleSendClick}
        >
          <FiSend />
        </IconButton>
      </Box>
    </div>
  );
};

export default ChatBotContainer;
