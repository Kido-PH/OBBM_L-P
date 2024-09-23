import React, { useState, useEffect } from "react";
import "../assets/css/menu.css";
import steak from "../assets/images/steak.png";

// Dữ liệu mẫu cho menu
const menuItems = {
  khaiVi: [
    { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
    { name: "Chả giò", price: "25,000 VND", image: steak },
  ],
  monChinh: [
    { name: "Cơm tấm", price: "40,000 VND", image: steak },
    { name: "Bún bò Huế", price: "50,000 VND", image: steak },
  ],
  trangMieng: [
    { name: "Chè ba màu", price: "15,000 VND", image: steak },
    { name: "Bánh flan", price: "10,000 VND", image: steak },
  ],
  thucUong: [
    { name: "Trà đá", price: "5,000 VND", image: steak },
    { name: "Cà phê sữa đá", price: "20,000 VND", image: steak },
  ],
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Cập nhật dữ liệu cho cardsContent
  const cardsContent = [
    {
      title: "Menu Bestseller 1",
      content: {
        khaiVi: [
          { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
          { name: "Chả giò", price: "25,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Cơm tấm", price: "40,000 VND", image: steak },
          { name: "Bún bò Huế", price: "50,000 VND", image: steak },
        ],
        trangMieng: [
          { name: "Chè ba màu", price: "15,000 VND", image: steak },
          { name: "Bánh flan", price: "10,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Trà đá", price: "5,000 VND", image: steak },
          { name: "Cà phê sữa đá", price: "20,000 VND", image: steak },
        ],
      },
    },
    {
      title: "Menu Bestseller 2",
      content: {
        khaiVi: [
          { name: "Món đặc biệt khai vị", price: "30,000 VND", image: steak },
          { name: "Salad trộn", price: "35,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Món đặc biệt chính", price: "35,000 VND", image: steak },
          { name: "Món xào đặc biệt", price: "45,000 VND", image: steak },
        ],
        trangMieng: [
          {
            name: "Món đặc biệt tráng miệng",
            price: "40,000 VND",
            image: steak,
          },
          { name: "Kem tươi", price: "20,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Nước ép trái cây", price: "30,000 VND", image: steak },
          { name: "Sinh tố", price: "25,000 VND", image: steak },
        ],
      },
    },
    {
      title: "Menu Bestseller 3",
      content: {
        khaiVi: [
          { name: "Món đặc biệt khai vị 2", price: "30,000 VND", image: steak },
          { name: "Món ăn nhẹ", price: "20,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Món đặc biệt chính 2", price: "35,000 VND", image: steak },
          { name: "Món nướng", price: "55,000 VND", image: steak },
        ],
        trangMieng: [
          {
            name: "Món đặc biệt tráng miệng 2",
            price: "45,000 VND",
            image: steak,
          },
          { name: "Bánh cheesecake", price: "30,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Món đặc biệt thức uống", price: "55,000 VND", image: steak },
          { name: "Trà sữa", price: "25,000 VND", image: steak },
        ],
      },
    },
  ];
  useEffect(() => {
    if (activeTab === "tab1") {
      const interval = setInterval(() => {
        setCurrentCardIndex(
          (prevIndex) => (prevIndex + 1) % cardsContent.length
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="menu-container">
      {/* Menu Left với Tabs */}
      <div className="menu-left">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "tab1" ? "active" : ""}`}
            onClick={() => setActiveTab("tab1")}>
            Tab 1
          </button>
          <button
            className={`tab ${activeTab === "tab2" ? "active" : ""}`}
            onClick={() => setActiveTab("tab2")}>
            Tab 2
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "tab1" && (
            <div className="cards-wrapper">
              {/* Card nhỏ bên trái */}
              <div className="card small-card">
                <h4>{cardsContent[(currentCardIndex + 2) % 3].title}</h4>
              </div>
              {/* Card chính giữa lớn hơn */}
              <div className="card main-card">
                <h3>{cardsContent[currentCardIndex].title}</h3>
                {Object.keys(cardsContent[currentCardIndex].content).map(
                  (section, idx) => (
                    <div key={idx}>
                      <h4>
                        {section === "khaiVi"
                          ? "Khai vị"
                          : section === "monChinh"
                          ? "Món chính"
                          : section === "trangMieng"
                          ? "Tráng miệng"
                          : "Thức uống"}
                      </h4>
                      <ul className="menu-list">
  {menuItems[section].map((item, idx) => (
    <li key={idx} className="menu-item">
      <img
        src={item.image}
        alt={item.name}
        className="menu-item-image"
      />
      <div className="menu-item-details">
        <span className="menu-item-name">{item.name}</span>
        <span className="menu-item-price">{item.price}</span>
      </div>
    </li>
  ))}
</ul>

                    </div>
                  )
                )}
              </div>
              {/* Card nhỏ bên phải */}
              <div className="card small-card">
                <h4>{cardsContent[(currentCardIndex + 1) % 3].title}</h4>
              </div>
            </div>
          )}
          {activeTab === "tab2" && (
            <div>
              <h3>Nội dung Tab 2</h3>
              <p>Đây là nội dung của Tab 2.</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Right (Giữ nguyên) */}
      <div className="menu-right">
        <h2>Menu Right</h2>
        {Object.keys(menuItems).map((section, index) => (
          <div className="menu-section" key={index}>
            <h3>
              {section === "khaiVi"
                ? "Khai vị"
                : section === "monChinh"
                ? "Món chính"
                : section === "trangMieng"
                ? "Tráng miệng"
                : "Thức uống"}
            </h3>
            <ul className="menu-list">
              {menuItems[section].map((item, idx) => (
                <li key={idx} className="menu-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="menu-item-image"
                  />
                  <div className="menu-item-details">
                    <span className="menu-item-name">{item.name}</span>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
