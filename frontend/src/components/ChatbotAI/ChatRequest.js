import React from "react";
import { Box, styled, Typography } from "@mui/material";
import { Image } from "react-bootstrap";

const ChatRequest = ({ step, eventName, content, costNguoiDung }) => {
  const ChatBubble = styled(Box)({
    maxWidth: "40%",
    backgroundColor: "#e3f2fd", // Màu nền khác cho user
    borderRadius: "12px",
    padding: "10px 16px",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  });

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}
    >
      {" "}
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
            Tôi muốn thực đơn {eventName} tầm giá {formatCurrency(costNguoiDung)} VND/người
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
