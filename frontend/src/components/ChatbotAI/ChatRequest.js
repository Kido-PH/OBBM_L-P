import React from "react";
import { Box, styled, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";

const ChatRequest = ({ step, eventName ,content, costNguoiDung }) => {
  const ChatBubble = styled(Box)({
    maxWidth: "40%",
    backgroundColor: "#e3f2fd", // Màu nền khác cho user
    borderRadius: "12px",
    padding: "10px 16px",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  });

  return (
    <div className="w-100 d-flex justify-content-end align-items-start mb-3">
      {/* Chat bubble */}
      <ChatBubble>
        {step === 2 && content === "change_event" && (
          <Typography variant="body2" color="textPrimary">
            Tôi muốn đổi sự kiện tiệc.
          </Typography>
        )}
        {step === 2 && content === "start_menu" && (
          <Typography variant="body2" color="textPrimary">
            Hãy hỗ trợ tôi lên thực đơn
          </Typography>
        )}
        {step === 3 && content === "create_menu" && (
          <Typography variant="body2" color="textPrimary">
            Tôi muốn thực đơn {eventName} tầm giá {costNguoiDung}/người
          </Typography>
        )}
      </ChatBubble>

      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          overflow: "hidden",
          marginLeft: "12px",
        }}
      >
        <Image
          src="/images/chatbot/avatar-logo.png"
          alt="User Avatar"
          width={36}
          height={36}
        />
      </Box>
    </div>
  );
};

export default ChatRequest;
