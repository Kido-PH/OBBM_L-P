import React, { useState, useRef, useEffect } from "react";
import "../assets/css/menu.css";
import "../assets/css/swipermenu.css";
import { calculateItemClass } from "../assets/js/untils.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListFood from "./listfood";
import menuApi from "../api/menuApi.js";
import eventApi from "../api/eventApi.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

const Menu = () => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Trạng thái hover
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentCardIndex, setCurrentCardIndex] = useState(1);
  const [showListFood, setShowListFood] = useState(false); // Kiểm soát hiển thị ListFood
  const [selectedCard, setSelectedCard] = useState(0); // Card chính giữa
  const [selectedId, setSelectedId] = useState(null); // Lưu sectionId
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuDishes, setSelectedMenuDishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [EventToMenuUrl, setEventToMenuUrl] = React.useState("");
  const location = useLocation();
  const [isModalEventsOpen, setIsModalEventsOpen] = useState(false);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const handleOpenModalEvents = () => {
    setIsModalEventsOpen(true);
  };
  const handleCloseModalEvents = () => {
    setIsModalEventsOpen(false);
  };
  const setMenuIdUrl = (eventId) => {
    setEventToMenuUrl(`menu/${eventId}`);
  };
  const pushEventIdtoMenu = (newEventId) => {
    // Điều hướng đến trang menu mới với eventId thay đổi
    navigate(`/menu/${newEventId}`);
  };
  const fetchEvent = async () => {
    const EventsList = await eventApi.getAll();
    setEvents(EventsList.result.content); // Cập nhật state
  };
  React.useEffect(() => {
    if (EventToMenuUrl) {
      navigate(EventToMenuUrl);
    }
  }, [EventToMenuUrl, navigate]);
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  const handleShowMenuPopup = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);

    const menuDishesList = menu.listMenuDish.map((menuDishes) => {
      return {
        dishesId: menuDishes?.dishes?.dishId,
        quantity: 1,
        price: menuDishes.dishes?.price,
        menuId: menu.menuId,
      };
    });
    setSelectedMenuDishes(menuDishesList);
  };

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzQ5NTc0Nzc1LCJpYXQiOjE3MzE1NzQ3NzUsImp0aSI6IjgzMTI2ZWIwLTg1ZjAtNGNlOC1hZDgyLTE5YzcyN2FmZGVlZSIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.vFWld-GMSCGLh0oocqvoTRutjA1cKgJpLhT2JjF96M03-JThuqUFxzzWR1BN7fQr0K2hDD7Ensvdp88W8c-Kow";
    sessionStorage.setItem("token", token);

    const fetchMenu = async () => {
      const response = await menuApi.getAll();
      const menuData = response.result.content;

      console.log("Menu Data from API:", menuData); // Kiểm tra dữ liệu từ API

      if (id) {
        const filteredMenuData = menuData.filter(
          (menu) => menu.events.eventId === parseInt(id, 10)
        );

        console.log("Filtered Menu Data:", filteredMenuData); // Kiểm tra dữ liệu đã lọc
        setMenu(filteredMenuData);
      }
      if (!id && location.pathname === "/menu") {
        handleOpenModalEvents(); // Mở modal khi không có id và đang ở trang "/menu"
      }
    };
    fetchEvent();
    fetchMenu();
  }, [id, location]);

  useEffect(() => {
    console.log("Current Path:", location.pathname);
    console.log("ID:", id);
    if (!id && location.pathname === "/menu") {
      handleOpenModalEvents();
    }
  }, [id, location]);

  const groupedMenu = menu.reduce((acc, category) => {
    const groupedDishes = category.listMenuDish.reduce((dishAcc, menuDish) => {
      const categoryName = menuDish.dishes.categories.name;

      if (!dishAcc[categoryName]) {
        dishAcc[categoryName] = [];
      }

      dishAcc[categoryName].push(menuDish.dishes);

      return dishAcc;
    }, {});

    acc[category.menuId] = {
      ...category,
      groupedDishes,
    };

    return acc;
  }, {});

  const groupedMenuArray = Object.values(groupedMenu);

  const handleCreateMenu = async () => {
    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const dataToSave = {
        name: selectedMenu.name,
        totalcost: 10000000,
        description: selectedMenu.description,
        userId: "U002",
        eventId: selectedMenu.events,
      };
      console.log("Phản hồi từ API tạo thực đơn:", dataToSave);
      localStorage.setItem("createdMenu", JSON.stringify(dataToSave));
      localStorage.setItem(
        "createdMenuDishes",
        JSON.stringify(selectedMenuDishes)
      );

      // Có thể hiển thị thông báo hoặc cập nhật giao diện
      alert("Thực đơn và món ăn đã được tạo thành công!");
      console.log(selectedMenu);
      console.log("menu dish gửi đi api:", selectedMenuDishes);
    } catch (error) {
      console.log("Lỗi khi tạo thực đơn hoặc món ăn:", error);
      alert("Không thể tạo thực đơn hoặc món ăn. Vui lòng thử lại.");
      console.log(selectedMenu);
    }
  };

  const handleAddDishToCategory = (dish, categoryId) => {
    setSelectedDishes((prevSelectedDishes) => {
      // Lấy danh sách hiện tại của danh mục hoặc tạo mảng mới
      const updatedCategoryDishes = prevSelectedDishes[categoryId]
        ? [...prevSelectedDishes[categoryId], dish]
        : [dish];

      return {
        ...prevSelectedDishes,
        [categoryId]: updatedCategoryDishes,
      };
    });
  };

  // Chuyển đổi đối tượng groupedMenu thành mảng để dễ render

  // Hàm bật/tắt hiển thị ListFood
  const toggleListFood = (id) => {
    setSelectedId(id);
    setShowListFood(true);
  };

  // Hàm để ẩn ListFood
  const closeListFood = () => {
    setShowListFood(false);
  };

  const addDishToCategory = (dish) => {
    const updatedMenu = { ...selectedMenu };
    const categoryName = Object.keys(updatedMenu.groupedDishes)[
      setSelectedId - 1
    ];
    updatedMenu.groupedDishes[categoryName].push(dish);
    setSelectedMenu(updatedMenu);
  };

  useEffect(() => {
    if (activeTab === "tab1") {
      const interval = setInterval(() => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % menu.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleRefreshMenu = () => {
    setSelectedMenu(null); // Reset the menu
  };

  return (
    <div className="Menu">
      <div className="menu-container">
        <div className="menu-left">
          <div className="tabs">
            {/* <button
            className={`tab btn-save-form ${
              activeTab === "tab1" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab1")}>
            Top menu
          </button> */}
            {/* <button
            className={`tab btn-save-form ${
              activeTab === "tab2" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab2")}>
            Chat Suggestion
          </button> */}
          </div>
          <div className="tab-content">
            {activeTab === "tab1" && (
              <div>
                <div className="container">
                  <h3
                    className="heading"
                    style={{ fontSize: "25px", color: "#191919" }}
                  >
                    Thực đơn gợi ý
                  </h3>
                  <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView={"auto"}
                    coverflowEffect={{
                      rotate: 0,
                      stretch: 0,
                      depth: 100,
                      modifier: 2.5,
                    }}
                    pagination={{ el: ".swiper-pagination", clickable: true }}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                      clickable: true,
                    }}
                    modules={[EffectCoverflow, Pagination, Navigation]}
                    className="swiper_container"
                  >
                    {groupedMenuArray.map((category) => (
                      <SwiperSlide
                        key={category.menuId}
                        onClick={() => handleSelectMenu(category)}
                      >
                        <div className="food-category">
                          <h4 style={{ textAlign: "center" }}>
                            {category.name}
                          </h4>
                          {Object.keys(category.groupedDishes).map(
                            (categoryName) => (
                              <div key={categoryName} className="menu-category">
                                <h6>{categoryName}</h6>
                                <div className="menu-category-dish">
                                  <ul
                                    className="promo-list has-scrollbar"
                                    style={{ paddingTop: "10px" }}
                                  >
                                    {category.groupedDishes[categoryName].map(
                                      (dish) => (
                                        <li key={dish.dishId}>
                                          <img
                                            src={dish.image}
                                            alt={dish.name}
                                            style={{
                                              width: "63px",
                                              height: "60px",
                                              marginLeft: "7px",
                                            }}
                                          />
                                          <p
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                              textAlign: "center",
                                              fontWeight: "bold",
                                              marginTop: "5px",
                                            }}
                                          >
                                            {dish.name}
                                          </p>
                                          <p
                                            style={{
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                              whiteSpace: "nowrap",
                                              textAlign: "center",
                                            }}
                                          >
                                            {/* {dish.price.toLocaleString()} VND */}
                                          </p>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div
                  className="choose-button-container"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu"
                    onClick={handleOpenModalEvents}
                    style={{
                      marginRight: "20px",
                      marginTop: "0px",
                      marginBottom: "20px",
                    }}
                  >
                    <p>Đổi sự kiện</p>
                  </button>
                </div>
                <Modal
                  show={isModalEventsOpen}
                  onHide={handleCloseModalEvents}
                  className="Modal-events"
                  style={{ maxH: "75%" }}
                >
                  <button className="add-button" onClick={handleCloseModalEvents} style={{color:"hsl(32, 100%, 59%)"}}>
                    x
                  </button>
                  <Modal.Header closeButton>
                    <Modal.Title>Sự Kiện</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <section
                      className="section section-divider white promo"
                      id="events"
                      style={{ paddingTop: "20px", paddingBottom: "30px" }}
                    >
                      <div className="" style={{marginLeft:"30px", marginRight:"30px"}} >
                        <ul className="promo-list has-scrollbar">
                          {Events.map((event) => (
                            <li
                              key={event.eventId}
                              className="promo-item"
                              style={{ width: "285px", height: "443px" }}
                            >
                              <button
                                onClick={() => {
                                  pushEventIdtoMenu(event.eventId); // Gọi hàm để lưu eventId vào URL
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

                                  <h3 className="h3 card-title">
                                    {event.name}
                                  </h3>

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
                  </Modal.Body>
                </Modal>
              </div>
            )}
            {activeTab === "tab2" && (
              <div className="tab2-content">{/* Nội dung cho tab 2 */}</div>
            )}
          </div>
        </div>

        {setSelectedId && (
          <ListFood
            onAddDish={addDishToCategory}
            categoryId={selectedId}
            show={showListFood}
            closeListFood={() => setShowListFood(false)}
          />
        )}
        {/* Hiển thị ListFood */}

        {/* Menu Right */}
        <div className="menu-right">
          <h2>Thực đơn</h2>
          {selectedMenu ? (
            <div>
              {/* <h3 className="menu-category-title">{selectedMenu.name}</h3> */}
              {Object.keys(selectedMenu.groupedDishes).map(
                (categoryName, index) => (
                  <div key={categoryName} className="menu-category-dish">
                    <h4>
                      {index === 0
                        ? "Khai vị"
                        : index === 1
                        ? "Món chính"
                        : index === 2
                        ? "Tráng miệng"
                        : "Đồ uống"}
                      <button
                        onClick={() => toggleListFood(index + 1)}
                        className="add-button"
                      >
                        +
                      </button>
                    </h4>
                    <ul
                      className="promo-list has-scrollbar"
                      style={{ paddingBottom: "10px" }}
                    >
                      {selectedMenu.groupedDishes[categoryName].map((dish) => (
                        <li key={dish.dishId}>
                          <img
                            src={dish.image}
                            alt={dish.name}
                            style={{
                              width: "63px",
                              height: "60px",
                              marginLeft: "25px",
                              borderRadius: "2rem",
                            }}
                          />
                          <p
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              fontWeight: "bold",
                              marginTop: "5px",
                              fontSize: "10px",
                              color: "#1e1e1e",
                            }}
                          >
                            {dish.name}
                          </p>
                          <p
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              fontSize: "10px",
                              color: "#1e1e1e",
                            }}
                          >
                            {dish.price.toLocaleString()} VND
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          ) : (
            <p>Chọn một thực đơn để hiển thị chi tiết.</p>
          )}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            
          {selectedMenu && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu"
            onClick={handleShowMenuPopup}
          >
            Xem thực đơn
          </button>
          <button
            className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu"
            onClick={handleCreateMenu}
          >
            Chọn thực đơn
          </button>
          
          <button
            className="btn btn-refresh-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu"
            onClick={handleRefreshMenu}
          >
            Làm mới thực đơn
          </button>
        </div>
      )}
            
          </div>
        </div>
        {/* Modal hiển thị thông tin thực đơn */}
        <Modal show={showModal} onHide={handleCloseModal}>
        <button className="add-button" onClick={handleCloseModal} style={{color:"hsl(32, 100%, 59%)"}}>
                    x
                  </button>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết Thực đơn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMenu ? (
              <div>
                <h4>{selectedMenu.name}</h4>
                {/* <p>Mô tả: {selectedMenu.description}</p> */}
                <p>
                  Tổng chi phí: {selectedMenu.totalcost.toLocaleString()} VND
                </p>
                {Object.keys(selectedMenu.groupedDishes).map(
                  (categoryName, index) => (
                    <div key={categoryName}>
                      <h5>
                        {index === 0
                          ? "Khai vị"
                          : index === 1
                          ? "Món chính"
                          : index === 2
                          ? "Tráng miệng"
                          : "Đồ uống"}
                      </h5>
                      <ul>
                        {selectedMenu.groupedDishes[categoryName].map(
                          (dish) => (
                            <li key={dish.dishId}>
                              <strong>{dish.name}</strong> -{" "}
                              {dish.price.toLocaleString()} VND
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>Không có thông tin thực đơn để hiển thị.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Menu;
