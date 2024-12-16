import React from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import { chatbotContext } from "./ChatbotContext";
import { Card, Image, Modal } from "react-bootstrap";
import eventApi from "api/eventApi";
import { checkAccessToken } from "services/checkAccessToken";
import { useNavigate } from "react-router-dom";
import chatbotAIApi from "api/chatbotAIApi";

const ChatResponse = ({ step, eventName, content, costNguoiDung }) => {
  const navigate = useNavigate();
  const { currentStep } = React.useContext(chatbotContext);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isModalEventsOpen, setIsModalEventsOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);
  const [Events, setEvents] = React.useState([]);
  const [currentEventInfo, setCurrentEventInfo] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [responseAI, setResponseAI] = React.useState(null); // Dữ liệu từ API

  const ChatBubble = styled(Box)({
    maxWidth: "50%",
    backgroundColor: "#fff8ec",
    borderRadius: "12px",
    padding: "10px 16px",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
  });

  React.useEffect(() => {
    let timer;

    // Tạo hàm async trong useEffect để sử dụng await
    const fetchData = async () => {
      if (content === "create_menu") {
        // Set data và gọi API
        const currentEventId = JSON.parse(
          localStorage.getItem("currentEventId")
        );

        // Cập nhật state `data` một cách bất đồng bộ

        console.log("Data gửi đi: ", currentEventId, costNguoiDung * 0.7);

        // Giả sử gọi API ở đây
        try {
          // Gọi API với async/await
          const apiResponse = await chatbotAIApi.createMenuAI(
            currentEventId,
            costNguoiDung * 0.7
          );
          setResponseAI(apiResponse);

          // Sau khi có phản hồi API, delay thêm 2 giây nữa trước khi hiển thị nội dung
          timer = setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.error("Error fetching API:", error);
        }
      } else {
        // Nếu không phải "create_menu", chỉ cần delay 2 giây để hiển thị nội dung
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    };

    // Gọi hàm async trong useEffect
    fetchData();

    // Dọn dẹp khi component bị unmount
    return () => {
      clearTimeout(timer);
    };
  }, [content, costNguoiDung]); // Thêm các dependencies

  const handleOpenModalEvents = () => {
    setIsModalEventsOpen(true);
  };

  const handleCloseModalEvents = () => {
    setIsModalEventsOpen(false);
  };

  const setNewCurrentEventId = (newEventId) => {
    setData((prevData) => ({
      ...prevData,
      eventId: newEventId,
    }));
    fetchEventInfo(newEventId);
    setIsNew(true);
  };

  const fetchEventInfo = async (eventId) => {
    try {
      const currentEvent = await eventApi.get(eventId);
      setCurrentEventInfo(currentEvent.result);
    } catch (error) {
      checkAccessToken(navigate);
    }
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

  React.useEffect(() => {
    console.log("response trả về: ", responseAI);
  }, [responseAI]);

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
        {isLoading ? (
          // Hiển thị GIF loading
          <Image
            src="/images/chatbot/loading-chat.gif"
            alt="Loading"
            width={32}
            height={28}
          />
        ) : (
          // Nội dung chính được render sau 2 giây
          <>
            {step === 1 && (
              <Typography variant="body2" color="textPrimary">
                Xin chào! Tôi là trợ lý OBBM. Tôi sẽ giúp bạn lên thực đơn phù
                hợp với {eventName} của bạn.
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
                {isNew && (
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{ marginTop: "10px" }}
                  >
                    Đã đổi sang sự kiện mới: {currentEventInfo?.name}
                  </Typography>
                )}
              </div>
            )}

            {step === 2 && content === "start_menu" && (
              <Typography variant="body2" color="textPrimary">
                Tất nhiên rồi, bạn muốn thực đơn có giá trị khoảng bao nhiêu
                trên 1 người?
              </Typography>
            )}
            {step === 3 &&
              content === "create_menu" &&
              responseAI?.result?.length === 2 && (
                <div>
                  <Typography variant="body2" color="textPrimary">
                    Đây là 2 menu có giá tiền phù hợp với yêu cầu của bạn (nhấn vào để xem chi tiết):
                  </Typography>
                  <div style={{ display: "flex", gap: "20px" }}>
                    {responseAI.result.map((menu, index) => (
                      <Card
                        className="card-menu-select"
                        // onClick={} //thực hiện hành động đổ ra ở đây
                        key={index}
                        style={{
                          width: "300px",
                          padding: "16px",
                          marginTop: "6px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="textPrimary"
                          sx={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          Thực đơn {index + 1}
                        </Typography>
                        <div>
                          {menu.listDish.map((dish, dishIndex) => (
                            <Typography
                              key={dishIndex}
                              variant="body2"
                              color="textSecondary"
                              sx={{ textAlign: "center" }}
                            >
                              {dish.name}
                            </Typography>
                          ))}
                        </div>
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginTop: "auto", // Đẩy xuống cuối
                          }}
                        >
                          Tổng giá: {menu.totalCost.toLocaleString()} VND
                        </Typography>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
          </>
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
