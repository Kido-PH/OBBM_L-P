import React, { useState, useEffect } from "react";
import "../assets/css/menu.css";
import steak from "../assets/images/steak.png";
import ListFood from "./listfood";

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
    { name: "Cà phê đá", price: "20,000 VND", image: steak },
  ],
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showListFood, setShowListFood] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0); // Mặc định là card chính giữa

  const toggleListFood = () => {
    setShowListFood(!showListFood); // Đảo ngược trạng thái hiển thị danh sách món ăn
  };

  const cardsContent = [
    {
      title: "Vietnamese Delight",
      content: {
        khaiVi: [
          { name: "Gỏi cuốn tôm thịt", price: "20,000 VND", image: steak },
          { name: "Chả giò chiên", price: "25,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Phở bò tái chín", price: "45,000 VND", image: steak },
          { name: "Bún bò Huế", price: "50,000 VND", image: steak },
        ],
        trangMieng: [
          { name: "Chè đậu xanh", price: "15,000 VND", image: steak },
          { name: "Bánh flan", price: "20,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Trà đá", price: "5,000 VND", image: steak },
          { name: "Cà phê sữa đá", price: "25,000 VND", image: steak },
        ],
      },
    },
    {
      title: "Western Feast",
      content: {
        khaiVi: [
          { name: "Caesar Salad", price: "35,000 VND", image: steak },
          { name: "Bruschetta", price: "30,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Beef Steak", price: "150,000 VND", image: steak },
          { name: "Spaghetti Carbonara", price: "70,000 VND", image: steak },
        ],
        trangMieng: [
          { name: "Tiramisu", price: "40,000 VND", image: steak },
          { name: "Chocolate Lava Cake", price: "50,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Red Wine", price: "150,000 VND", image: steak },
          { name: "Sparkling Water", price: "20,000 VND", image: steak },
        ],
      },
    },
    {
      title: "Japanese Experience",
      content: {
        khaiVi: [
          { name: "Sushi Maki", price: "40,000 VND", image: steak },
          { name: "Edamame", price: "20,000 VND", image: steak },
        ],
        monChinh: [
          { name: "Ramen", price: "60,000 VND", image: steak },
          { name: "Tempura Udon", price: "70,000 VND", image: steak },
        ],
        trangMieng: [
          { name: "Matcha Ice Cream", price: "25,000 VND", image: steak },
          { name: "Mochi", price: "30,000 VND", image: steak },
        ],
        thucUong: [
          { name: "Sake", price: "100,000 VND", image: steak },
          { name: "Trà xanh Nhật Bản", price: "30,000 VND", image: steak },
        ],
      },
    },
  ];

  // Các loại tiệc mẫu
  const partyTypes = ["Birhdays", "Wedding", "Anniversary"];

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
      <div
        className="menu-left"
        style={{ display: showListFood ? "hide" : "block" }}
      >
        <div className="tabs">
          <button
            className={`tab btn-save-form ${
              activeTab === "tab1" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab1")}
          >
            Top menu
          </button>
          <button
            className={`tab btn-save-form ${
              activeTab === "tab2" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            Chat Suggestion
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "tab1" && (
            <div>
              <div className="cards-wrapper">
                {/* Card nhỏ bên trái */}
                <div
                  className="card small-card"
                  onClick={() => setSelectedCard((currentCardIndex + 2) % 3)}
                >
                  <h4>{cardsContent[(currentCardIndex + 2) % 3].title}</h4>
                  <ul className="menu-list">
                    {Object.keys(
                      cardsContent[(currentCardIndex + 2) % 3].content
                    ).map((section, idx) =>
                      cardsContent[(currentCardIndex + 2) % 3].content[
                        section
                      ].map((item, subIdx) => (
                        <li key={`${idx}-${subIdx}`} className="menu-item">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="menu-item-image"
                          />
                          <div className="menu-item-details">
                            <span className="menu-item-name">{item.name}</span>
                            <span className="menu-item-price">
                              {item.price}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                {/* Card chính giữa lớn hơn */}
                <div
                  className="card main-card"
                  onClick={() => setSelectedCard(currentCardIndex)}
                >
                  <h3>{cardsContent[currentCardIndex].title}</h3>
                  {Object.keys(cardsContent[currentCardIndex].content).map(
                    (section, idx) => (
                      <div key={idx}>
                        <h4>
                          {section === "khaiVi"
                            ? "Appetizer"
                            : section === "monChinh"
                            ? "Main course"
                            : section === "trangMieng"
                            ? "Dessert"
                            : "Drinks"}
                        </h4>
                        <ul className="menu-list">
                          {cardsContent[currentCardIndex].content[section].map(
                            (item, subIdx) => (
                              <li key={subIdx} className="menu-item">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="menu-item-image"
                                />
                                <div className="menu-item-details">
                                  <span className="menu-item-name">
                                    {item.name}
                                  </span>
                                  <span className="menu-item-price">
                                    {item.price}
                                  </span>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                {/* Card nhỏ bên phải */}
                <div
                  className="card small-card"
                  onClick={() => setSelectedCard((currentCardIndex + 1) % 3)}
                >
                  <h4 className="small-card-h4">
                    {cardsContent[(currentCardIndex + 1) % 3].title}
                  </h4>
                  <ul className="menu-list">
                    {Object.keys(
                      cardsContent[(currentCardIndex + 1) % 3].content
                    ).map((section, idx) =>
                      cardsContent[(currentCardIndex + 1) % 3].content[
                        section
                      ].map((item, subIdx) => (
                        <li key={`${idx}-${subIdx}`} className="menu-item">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="menu-item-image"
                          />
                          <div className="menu-item-details">
                            <span className="menu-item-name">{item.name}</span>
                            <span className="menu-item-price">
                              {item.price}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>

              <div className="choose-button-container">
                <select className="choose-combobox">
                  {partyTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {activeTab === "tab2" && (
            <div className="tab2-content">
              {/* <div className="menu-section">
            <h3>Menu</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
              
            </ul>
          </div>
          <div className="chat-section">
            <h3>Chat Display</h3>
            <div className="messages">
              <p><strong>User 1:</strong> Chào bạn!</p>
              <p><strong>User 2:</strong> Xin chào!</p>
              <p><strong>User 1:</strong> Bạn có khỏe không?</p>
              
            </div>
            <div className="chat-input">
              <textarea placeholder="Nhập tin nhắn ở đây..." rows="3" />
              <button className="send-button">Gửi</button>
            </div>
          </div> */}
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị ListFood */}
      <ListFood show={showListFood} />

      {/* Menu Right */}
      <div className="menu-right">
        <h2>Menu</h2>
        {Object.keys(cardsContent[selectedCard].content).map(
          (section, index) => (
            <div className="menu-section" key={index}>
              <h3>
                {section === "khaiVi"
                  ? "Appetizer"
                  : section === "monChinh"
                  ? "Main course"
                  : section === "trangMieng"
                  ? "Dessert"
                  : "Drinks"}
                <button onClick={toggleListFood} className="add-button">
                  +
                </button>{" "}
                {/* Dấu + */}
              </h3>
              <ul className="menu-list">
                {cardsContent[selectedCard].content[section].map(
                  (item, idx) => (
                    <li key={idx} className="menu-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="menu-item-image"
                      />
                      <div className="menu-item-details">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-price">{item.price}</span>
                        <button className="remove-button">x</button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          )
        )}
        <div style={{ textAlign: "center" }}>
          <button className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover view-menu">
            View Menu
          </button>
          <button className="btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover create-menu">
            Create Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;