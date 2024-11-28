import React, { useState, useRef, useEffect } from "react";
import "../assets/css/menu.css";
import "../assets/css/swipermenu.css";
import { calculateItemClass } from "../assets/js/untils.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ListFood from "./listfood";
import menuApi from "../api/menuApi.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
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

  const handleShowMenuPopup = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

  const handleSelectMenu = (menu) => {
    setSelectedMenu(menu);

    const menuDishesList = menu.listMenuDish.map((menuDishes) =>{
      return {
        dishesId: menuDishes?.dishes?.dishId,
        quantity: 1,
        price: menuDishes.dishes?.price,
        menuId: menu.menuId,
      };
    })
    setSelectedMenuDishes(menuDishesList);
  };

  const [menu, setMenu] = useState([]);

    const { id } = useParams();
  
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxOTczMjYyMDAyNSwiaWF0IjoxNzMyNjIwMDI1LCJqdGkiOiI2ZGRlNjdiZS0zMzQ0LTQxZDUtYTU3Ni04OTA5ZGM1ZmM2MjYiLCJzY29wZSI6IlJPTEVfQURNSU4gREVMRVRFX0RJU0ggQ1JFQVRFX1VTRVIgVVBEQVRFX1NFUlZJQ0VTIERFTEVURV9FVkVOVCBERUxFVEVfTE9DQVRJT04gUkVBRF9TRVJWSUNFUyBSRUFEX0VWRU5UIENSRUFURV9DT05UUkFDVCBSRUFEX0xPQ0FUSU9OIFJFQURfSU5HUkVESUVOVCBERUxFVEVfVVNFUiBDUkVBVEVfTUVOVSBERUxFVEVfU0VSVklDRVMgQ1JFQVRFX0xPQ0FUSU9OIENSRUFURV9FVkVOVCBSRUFEX0NPTlRSQUNUIFVQREFURV9NRU5VIFJFQURfRElTSCBDUkVBVEVfU0VSVklDRVMgREVMRVRFX01FTlUgVVBEQVRFX0VWRU5UIENSRUFURV9ESVNIIFJFQURfVVNFUiBVUERBVEVfTE9DQVRJT04gVVBEQVRFX0NPTlRSQUNUIFVQREFURV9JTkdSRURJRU5UIENSRUFURV9JTkdSRURJRU5UIERFTEVURV9JTkdSRURJRU5UIERFTEVURV9DT05UUkFDVCBSRUFEX01FTlUgVVBEQVRFX0RJU0ggVVBEQVRFX1VTRVIifQ.NnO0wvCCVPocl4drBMPUVIugOHkU1SeCshIGORvUsihjO4IbPXjzJc2N4_SYC9tinOd77_NhvVoZ8h1yztfGlw";
    sessionStorage.setItem("token", token);

    const fetchMenu = async () => {
      const response = await menuApi.getAll();
      const menuData = response.result.content;
      console.log(menuData);
      setMenu(menuData);
    };

    fetchMenu();
  }, []);

  const handleCreateMenu = async () => {
    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const dataToSave = {
        name: selectedMenu.name,
        totalcost: 10000000,
        description: selectedMenu.description,
        userId: "U002",
        eventId: 1,
      };
      console.log("Phản hồi từ API tạo thực đơn:", dataToSave); 
      localStorage.setItem("createdMenu", JSON.stringify(dataToSave));
      localStorage.setItem("createdMenuDishes", JSON.stringify(selectedMenuDishes));

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
  const groupedMenu = menu.reduce((acc, category) => {
    // Tạo đối tượng để lưu các món ăn theo categoryId
    const groupedDishes = category.listMenuDish.reduce((dishAcc, menuDish) => {
      const categoryName = menuDish.dishes.categories.name; // Lấy tên category từ menuDish

      // Nếu categoryName chưa tồn tại trong dishAcc, tạo một mảng mới
      if (!dishAcc[categoryName]) {
        dishAcc[categoryName] = [];
      }

      // Thêm món ăn vào đúng category
      dishAcc[categoryName].push(menuDish.dishes);

      return dishAcc;
    }, {});

    // Lưu lại thông tin category và nhóm món ăn theo categoryName
    acc[category.menuId] = {
      ...category,
      groupedDishes,
    };

    return acc;
  }, {});

  // Chuyển đổi đối tượng groupedMenu thành mảng để dễ render
  const groupedMenuArray = Object.values(groupedMenu);

  // Hàm để thêm món ăn vào menu-right
  const addDishToMenuRight = (dish) => {
    setSelectedDishes((prevDishes) => [...prevDishes, dish]);
  };

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

  const getSectionId = (section) => {
    switch (section) {
      case "khaiVi":
        return 1;
      case "monChinh":
        return 2;
      case "trangMieng":
        return 3;
      default:
        return 4; // Drinks
    }
  };

  return (
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
                <h2 className="heading" style={{ fontSize: "20px" }}>
                  Thực đơn gợi ý
                </h2>
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
                        <h3 style={{ textAlign: "center" }}>{category.name}</h3>
                        {Object.keys(category.groupedDishes).map(
                          (categoryName) => (
                            <div key={categoryName} className="menu-category">
                              <h5>{categoryName}</h5>
                              <div className="menu-category-dish">
                                <ul
                                  className="promo-list has-scrollbar"
                                  style={{ paddingBottom: "10px" }}
                                >
                                  {category.groupedDishes[categoryName].map(
                                    (dish) => (
                                      <li key={dish.dishId}>
                                        <img src={dish.image} alt={dish.name} />
                                        <p
                                          style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
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
                                          {dish.price.toLocaleString()} VND
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

              <div className="choose-button-container">
                <button className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu">
                  <a href="/event">Event</a>
                </button>
              </div>
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
            <h3 className="menu-category-title">{selectedMenu.name}</h3>
            {Object.keys(selectedMenu.groupedDishes).map(
              (categoryName, index) => (
                <div key={categoryName} className="menu-category">
                  <h3>
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
                  </h3>
                  <ul
                    className="promo-list has-scrollbar"
                    style={{ paddingBottom: "10px" }}
                  >
                    {selectedMenu.groupedDishes[categoryName].map((dish) => (
                      <li key={dish.dishId}>
                      <img src={dish.image} alt={dish.name} />
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: "center",
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
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu"
            onClick={handleShowMenuPopup}
          >
            Xem thực đơn
          </button>
          <button
            className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu"
            onClick={handleCreateMenu}
          >
            Tạo thực đơn
          </button>
        </div>
        
      </div>
      {/* Modal hiển thị thông tin thực đơn */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Thực đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMenu ? (
            <div>
              <h4>{selectedMenu.name}</h4>
              <p>Mô tả: {selectedMenu.description}</p>
              <p>Tổng chi phí: {selectedMenu.totalcost.toLocaleString()} VND</p>
              {Object.keys(selectedMenu.groupedDishes).map((categoryName, index) => (
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
                    {selectedMenu.groupedDishes[categoryName].map((dish) => (
                      <li key={dish.dishId}>
                        <strong>{dish.name}</strong> - {dish.price.toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có thông tin thực đơn để hiển thị.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Menu;
