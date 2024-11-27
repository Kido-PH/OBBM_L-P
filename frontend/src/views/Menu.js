import React, { useState, useEffect } from "react";
import "../assets/css/menu.css";
import "../assets/css/listFood.css";
import "../assets/css/swipermenu.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListFood from "../components/Menu/listfood";
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
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const Menu = () => {
  const [showListFood, setShowListFood] = useState(false); // Kiểm soát hiển thị ListFood
  const [latestMenuId, setLatestMenuId] = useState(0);
  const [selectedId, setSelectedId] = useState(null); // Lưu sectionId
  const [menuList, setMenuList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedMenuDishes, setSelectedMenuDishes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [EventToMenuUrl, setEventToMenuUrl] = React.useState("");
  const location = useLocation();
  const [isModalEventsOpen, setIsModalEventsOpen] = useState(false);
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
    localStorage.setItem("currentEventId", newEventId);
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

  const handleShowMenuPopup = (menu) => {
    // // Lấy menuId lớn nhất từ cơ sở dữ liệu hoặc danh sách menu
    // const latestMenuId = Math.max(...menuList.map((menu) => menu.menuId), 0);
    // const newMenuId = latestMenuId + 1;

    // // Cập nhật menuId cho selectedMenu
    // const updatedMenu = { ...menu, menuId: newMenuId };
    // setSelectedMenu(updatedMenu);

    setShowModal(true); // Hiển thị modal
  };
  const handleCloseModal = () => setShowModal(false);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);
    const latestMenuId =
      menuList && menuList.length > 0
        ? Math.max(...menuList.map((menu) => menu.menuId), 0)
        : 0;

    const menuDishesList = menu.listMenuDish.map((menuDishes) => {
      return {
        dishesId: menuDishes?.dishes?.dishId,
        quantity: 1,
        price: menuDishes.dishes?.price,
        menuId: null,
      };
    });
    setSelectedMenuDishes(menuDishesList);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await menuApi.getAllMenuAdmin();
      const menuData = response.result.content;

      // console.log("Menu Data from API:", menuData);

      if (id) {
        const filteredMenuData = menuData.filter(
          (menu) => menu.events.eventId === parseInt(id, 10)
        );

        // console.log("Filtered Menu Data:", filteredMenuData);
        setMenu(filteredMenuData);
      }
      if (!id && location.pathname === "/menu") {
        handleOpenModalEvents(); // Mở modal khi không có id và đang ở trang "/menu"
      }
    };
    const fetchMenuList = async () => {
      try {
        const response = await menuApi.getAll(); // Gọi API lấy danh sách menu
        const menuList = response.result?.content || []; // Lấy danh sách thực đơn hoặc mảng rỗng

        // Lấy menuId lớn nhất
        const latestMenuId =
          menuList.length > 0
            ? Math.max(...menuList.map((menu) => menu.menuId))
            : 0;

        setMenuList(menuList); // Lưu danh sách thực đơn vào state
        setLatestMenuId(latestMenuId); // Lưu menuId lớn nhất vào state (nếu cần)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách menu:", error);
        setMenuList([]); // Nếu lỗi, gán danh sách thực đơn rỗng
      }
    };

    fetchMenuList();
    fetchEvent();
    fetchMenu();
    fetchMenuList();
    const latestMenuId =
      menuList && menuList.length > 0
        ? Math.max(...menuList.map((menu) => menu.menuId), 0)
        : 0;

    // console.log("selectedMenu Menu Data:", selectedMenu);
  }, [id, location]);

  useEffect(() => {
    // console.log("Current Path:", location.pathname);
    // console.log("ID:", id);
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
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("Người dùng chưa đăng nhập.");
      }

      const totalCost = Object.values(selectedMenu.groupedDishes)
        .flat()
        .reduce((total, dish) => total + (dish.price || 0), 0);

      // Loại bỏ các món ăn trùng lặp trong selectedMenuDishes
      const uniqueDishes = selectedMenuDishes.reduce((acc, currentDish) => {
        if (!acc.some((dish) => dish.dishesId === currentDish.dishesId)) {
          acc.push(currentDish);
        }
        return acc;
      }, []);

      // Chuẩn bị dữ liệu để gửi lên server
      const dataToSave = {
        name: selectedMenu.name,
        totalcost: totalCost,
        description: selectedMenu.description,
        userId: userId, // Lấy userId từ localStorage
        eventId: selectedMenu.events.eventId,
      };

      console.log("Phản hồi từ API tạo thực đơn:", dataToSave);

      // Lưu dữ liệu đã được loại bỏ trùng lặp vào localStorage
      localStorage.setItem("createdMenu", JSON.stringify(dataToSave));
      localStorage.setItem("createdMenuDishes", JSON.stringify(uniqueDishes));

      Swal.fire({
        icon: "success",
        title: "Tạo thực đơn thành công!",
        text: "Tiếp tục các bước sau để hoàn thành đặt tiệc nhé!",
      });
      navigate("/contract");
      console.log(selectedMenu);
      console.log("menu dish gửi đi api:", selectedMenuDishes);
    } catch (error) {
      console.error("Lỗi khi tạo thực đơn hoặc món ăn:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Không thể tạo thực đơn hoặc món ăn. Vui lòng thử lại.",
      });
    }
  };

  const toggleListFood = (id) => {
    setSelectedId(id);
    setShowListFood(true);
  };

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

  const handleAddDish = (dish) => {
    // Kiểm tra xem món ăn đã tồn tại trong selectedMenuDishes hay chưa
    const isDishExists = selectedMenuDishes.some(
      (existingDish) => existingDish.dishesId === dish.dishId
    );

    if (isDishExists) {
      // Hiển thị thông báo món ăn đã tồn tại
      Swal.fire({
        icon: "info",
        title: "Món ăn đã tồn tại",
        text: `Món "${dish.name}" đã có trong danh sách!`,
      });
      return; // Kết thúc hàm nếu món ăn đã tồn tại
    }

    // Nếu chưa tồn tại, tiến hành thêm món
    setSelectedMenu((prevMenu) => {
      const categoryName = dish.categories.name; // Lấy tên category từ dish
      const updatedGroupedDishes = { ...prevMenu.groupedDishes };

      // Nếu category chưa tồn tại, tạo mảng mới
      if (!updatedGroupedDishes[categoryName]) {
        updatedGroupedDishes[categoryName] = [];
      }

      // Thêm món ăn vào category
      updatedGroupedDishes[categoryName] = [
        ...updatedGroupedDishes[categoryName],
        dish,
      ];

      // Cập nhật selectedMenuDishes với món ăn mới
      setSelectedMenuDishes((prevDishes) => [
        ...prevDishes,
        {
          dishesId: dish.dishId,
          quantity: 1, // Hoặc lấy giá trị quantity từ đâu đó nếu cần
          price: dish.price,
          menuId: null,
        },
      ]);
      return {
        ...prevMenu,
        groupedDishes: updatedGroupedDishes,
      };
    });

    setSelectedMenuDishes((prevDishes) => {
      // Thêm món mới vào danh sách
      const updatedDishesList = [
        ...prevDishes,
        {
          dishesId: dish.dishId,
          quantity: 1,
          price: dish.price,
          menuId: null,
        },
      ];

      // Loại bỏ các món trùng lặp dựa trên dishId
      const uniqueDishes = updatedDishesList.reduce((acc, currentDish) => {
        if (!acc.some((dish) => dish.dishesId === currentDish.dishesId)) {
          acc.push(currentDish);
        }
        return acc;
      }, []);

      return uniqueDishes; // Cập nhật lại danh sách không trùng lặp
    });
  };

  // useEffect(() => {
  //   if (activeTab === "tab1") {
  //     const interval = setInterval(() => {
  //       setCurrentCardIndex((prevIndex) => (prevIndex + 1) % menu.length);
  //     }, 4000);

  //     return () => clearInterval(interval);
  //   }
  // }, [activeTab]);

  const handleRefreshMenu = () => {
    setSelectedMenu(null); // Reset the menu
  };

  const handleRemoveDish = (categoryName, dishId) => {
    setSelectedMenu((prevMenu) => {
      const updatedGroupedDishes = { ...prevMenu.groupedDishes };

      // Lọc bỏ món ăn với dishId tương ứng
      updatedGroupedDishes[categoryName] = updatedGroupedDishes[
        categoryName
      ].filter((dish) => dish.dishId !== dishId);

      // Cập nhật selectedMenuDishes để xóa món ăn khỏi danh sách
      setSelectedMenuDishes((prevDishes) => {
        // Lọc bỏ món ăn từ danh sách selectedMenuDishes theo dishId
        const updatedDishesList = prevDishes.filter(
          (dish) => dish.dishesId !== dishId
        );
        return updatedDishesList; // Trả về danh sách đã cập nhật
      });

      return {
        ...prevMenu,
        groupedDishes: updatedGroupedDishes,
      };
    });
  };

  let swiperRef = null;

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
                  }}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="swiper_container"
                  loop={groupedMenuArray.length > 1}
                >
                  {groupedMenuArray.map((category, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={() => handleSelectMenu(category)}
                    >
                      <div className="food-category">
                        <h4 style={{ textAlign: "center" }}>{category.name}</h4>
                        {Object.keys(category.groupedDishes).map(
                          (categoryName) => (
                            <div key={categoryName} className="menu-category">
                              <h6>
                                {categoryName === "Appetizers"
                                  ? "Khai vị và đồ uống"
                                  : categoryName === "Main Courses"
                                  ? "Món chính"
                                  : categoryName === "Desserts"
                                  ? "Tráng miệng"
                                  : categoryName}
                              </h6>

                              <div className="menu-category-dish">
                                <ul
                                  className="promo-list has-scrollbar"
                                  style={{ paddingTop: "10px" }}
                                >
                                  {category.groupedDishes[categoryName].map(
                                    (dish, index) => (
                                      <li key={index} style={{ width: "77px" }}>
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
                        <div
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            paddingTop: "10px",
                          }}
                        >
                          <p style={{ color: "rgb(66 66 66)" }}>
                            Tổng tiền:{" "}
                            {Object.values(category.groupedDishes)
                              .flat()
                              .reduce(
                                (total, dish) => total + (dish.price || 0),
                                0
                              )
                              .toLocaleString()}{" "}
                            VND
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="slider-controler">
                    <div className="swiper-button-prev slider-arrow">
                      <ion-icon name="arrow-back-outline"></ion-icon>
                    </div>
                    <div className="swiper-button-next slider-arrow">
                      <ion-icon name="arrow-forward-outline"></ion-icon>
                    </div>
                  </div>
                </Swiper>
                <div
                  className="choose-button-container"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu"
                    onClick={handleOpenModalEvents}
                    style={{
                      marginRight: "0px",
                      marginTop: "0px",
                      marginBottom: "20px",
                    }}
                  >
                    <p>Đổi sự kiện</p>
                  </button>
                </div>
              </div>

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

                  <div
                    className=""
                    style={{ marginLeft: "30px", marginRight: "30px" }}
                  >
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
          </div>
        </div>

        {setSelectedId && (
          <ListFood
            onAddDish={handleAddDish}
            categoryId={selectedId}
            show={showListFood}
            closeListFood={() => setShowListFood(false)}
          />
        )}

        {/* Menu Right */}
        <div className="menu-right">
          <h2 style={{ marginBottom: "0px" }}>Thực đơn</h2>
          {selectedMenu ? (
            <div>
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
                        style={{ color: "#02AF55" }}
                      >
                        <FaPlus style={{ width: "14px", marginLeft: "20px" }} />{" "}
                      </button>
                    </h4>
                    <ul
                      className="promo-list has-scrollbar"
                      style={{ paddingBottom: "10px" }}
                    >
                      {selectedMenu.groupedDishes[categoryName].map(
                        (dish, index) => (
                          <li key={index} style={{ width: "119px" }}>
                            <button
                              onClick={() =>
                                handleRemoveDish(categoryName, dish.dishId)
                              }
                              style={{
                                color: "red",
                                marginLeft: "90px",
                                width: "10px",
                              }}
                              title="Xóa món ăn"
                            >
                              <FaMinus style={{ width: "10px" }} />
                            </button>
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
                        )
                      )}
                    </ul>
                  </div>
                )
              )}
              <div style={{ textAlign: "right", fontWeight: "bold" }}>
                Tổng tiền:{" "}
                {Object.values(selectedMenu.groupedDishes)
                  .flat()
                  .reduce((total, dish) => total + (dish.price || 0), 0)
                  .toLocaleString()}{" "}
                VND
              </div>
            </div>
          ) : (
            <p>Chọn một thực đơn để hiển thị chi tiết.</p>
          )}
          <div>
            {selectedMenu && (
              <div
                className="button-container d-flex"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu"
                  onClick={handleShowMenuPopup}
                  style={{ width: "100%", height: "35px" }}
                >
                  <a style={{ fontSize: "10px" }}>Xem thực đơn</a>
                </button>
                <button
                  className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu"
                  onClick={handleCreateMenu}
                  style={{ width: "100%", height: "35px" }}
                >
                  <a style={{ fontSize: "10px" }}>Tạo thực đơn</a>
                </button>
                <button
                  className="btn btn-refresh-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu"
                  onClick={handleRefreshMenu}
                  style={{ width: "100%", height: "35px" }}
                >
                  <a style={{ fontSize: "10px" }}>Làm mới thực đơn</a>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal hiển thị thông tin thực đơn */}
        <Modal show={showModal} onHide={handleCloseModal}>
          {selectedMenu ? (
            <div style={{ width: "420px", margin: "0 auto" }}>
              <button
                className="add-button"
                onClick={handleCloseModal}
                style={{ color: "hsl(32, 100%, 59%)" }}
              >
                <FaTimes
                  style={{ color: "#341c0e", width: "12px", marginTop: "12px" }}
                />{" "}
                {/* X icon for "Remove" */}
              </button>
              <div className="chiTietThucDon">
                {/* <h2>Chi Tiết thực đơn</h2> */}
                {/* <h2>{selectedMenu.name}</h2> */}
                {/* <p>Mô tả: {selectedMenu.description}</p> */}
                {/* <p>Tổng chi phí: {selectedMenu.totalcost.toLocaleString()} VND</p> */}
                <div className="menu-view-control">
                  {Object.keys(selectedMenu.groupedDishes).map(
                    (categoryName, index) => (
                      <div key={categoryName} style={{ marginBottom: "8px" }}>
                        <h3>
                          {index === 0
                            ? "Khai vị"
                            : index === 1
                            ? "Món chính"
                            : index === 2
                            ? "Tráng miệng"
                            : "Đồ uống"}
                        </h3>
                        <ul>
                          {selectedMenu.groupedDishes[categoryName].map(
                            (dish, index) => (
                              <li key={index}>
                                <strong>{dish.name}</strong>{" "}
                                {/* {dish.price.toLocaleString()} VND */}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>Không có thông tin thực đơn để hiển thị.</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Menu;
