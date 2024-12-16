import React from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import { chatbotContext } from "./ChatbotContext";
import { Image, Modal } from "react-bootstrap";
import eventApi from "api/eventApi";
import { checkAccessToken } from "services/checkAccessToken";
import { useNavigate } from "react-router-dom";

const ChatResponse = ({ step, eventName, content }) => {
  const navigate = useNavigate();
  const { currentStep } = React.useContext(chatbotContext);

  const [isModalEventsOpen, setIsModalEventsOpen] = React.useState(false);
  const [Events, setEvents] = React.useState([]);

  const ChatBubble = styled(Box)({
    maxWidth: "40%",
    backgroundColor: "#fff8ec",
    borderRadius: "12px",
    padding: "10px 16px",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  });

  const handleOpenModalEvents = () => {
    setIsModalEventsOpen(true);
  };

  const handleCloseModalEvents = () => {
    setIsModalEventsOpen(false);
  };

  const setNewCurrentEventId = (eventId) => {
    localStorage.setItem("currentEventId", eventId);
    // set
  };

  const fetchEvents = async () => {
    try {
      const response = await eventApi.getAll(1, 1000);
      setEvents(response.result.content);
    } catch (error) {
      checkAccessToken(navigate);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}
    >
      {" "}
      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: "12px",
        }}
      >
        <Image
          src="/images/chatbot/chatbot-logo.jpg"
          alt="Chatbot Logo"
          width={36}
          height={36}
        />
      </Box>
      <ChatBubble>
        {step === 1 && (
          <Typography variant="body2" color="textPrimary">
            Xin chào! Tôi là trợ lý OBBM. Tôi sẽ giúp bạn lên thực đơn phù hợp
            với {eventName} của bạn.
          </Typography>
        )}

        {step === 2 && content === "change_event" && (
          <div>
            <Typography variant="body2" color="textPrimary">
              Tôi hiểu rồi, Dưới đây là các sự kiện mà bạn có thể đổi
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center", // Căn giữa theo chiều ngang
                alignItems: "center", // Căn giữa theo chiều dọc
                height: "100%", // Đảm bảo chiều cao của container đủ lớn để căn giữa
              }}
            >
              {" "}
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenModalEvents}
                sx={{
                  marginTop: "6px",
                  fontSize: "12px",
                  backgroundColor: "var(--dark-orange)",
                }}
              >
                Đổi sự kiện
              </Button>
            </Box>
          </div>
        )}
      </ChatBubble>
      <Modal
        show={isModalEventsOpen}
        onHide={handleCloseModalEvents}
        className="Modal-events"
        style={{ maxH: "75%" }}
      >
        <section
          className="section section-divider white promo"
          id="events"
          style={{
            paddingTop: "20px",
            paddingBottom: "30px",
            marginTop: "50px",
            width: "100%",
          }}
        >
          <button
            className="add-button"
            onClick={handleCloseModalEvents}
            style={{ color: "hsl(32, 100%, 59%)" }}
          >
            x
          </button>
          <h2 style={{ textAlign: "center" }}>Sự kiện</h2>

          <div className="" style={{ marginLeft: "30px", marginRight: "30px" }}>
            <ul className="promo-list has-scrollbar">
              {Events.reverse().map((event) => (
                <li
                  key={event.eventId}
                  className="promo-item"
                  style={{
                    width: "285px",
                    height: "443px",
                  }}
                >
                  <button
                    onClick={() => {
                      setNewCurrentEventId(event.eventId); // Gọi hàm để lưu eventId vào URL
                      handleCloseModalEvents(); // Đóng modal ngay sau khi chọn sự kiện
                    }}
                  >
                    <div
                      className="promo-card"
                      style={{ width: "285px", height: "443px" }}
                    >
                      <div className="card-icon">
                        {/* Add any specific icons or elements here if needed */}
                      </div>

                      <h3 className="h3 card-title">{event.name}</h3>

                      <p
                        className="card-text"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {event.description}
                      </p>

                      <img
                        src={event.image}
                        width="300"
                        height="300"
                        loading="lazy"
                        alt={event.name}
                        className="w-100 card-banner"
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Modal>
    </div>
  );
};

export default ChatResponse;
