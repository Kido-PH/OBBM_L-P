import React, { useState } from 'react';
import "../assets/css/listFood.css";
import steak from "../assets/images/steak.png";

// Dữ liệu món ăn
const foodCategories = [
  {
    category: "Khai Vị",
    items: [
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
      { name: "Chả giò", price: "25,000 VND", image: steak },
      { name: "Bánh mì", price: "15,000 VND", image: steak },
      { name: "Gỏi cuốn", price: "20,000 VND", image: steak },
    ],
  },
  // {
  //   category: 'Món Chính',
  //   items: [
  //     { name: 'Cơm tấm', price: '40,000 VND', image: steak },
  //     { name: 'Bún bò Huế', price: '50,000 VND', image: steak },
  //     { name: 'Phở', price: '45,000 VND', image: steak },
  //     { name: 'Bún bò Huế', price: '50,000 VND', image: steak },
  //     { name: 'Phở', price: '45,000 VND', image: steak }
  //   ],
  // },
  // {
  //   category: 'Tráng Miệng',
  //   items: [
  //     { name: 'Chè ba màu', price: '15,000 VND', image: steak },
  //     { name: 'Bánh flan', price: '10,000 VND', image: steak },
  //     { name: 'Kem', price: '20,000 VND', image: steak },
  //     { name: 'Chè ba màu', price: '15,000 VND', image: steak },
  //     { name: 'Bánh flan', price: '10,000 VND', image: steak },
  //   ],
  // },
  // {
  //   category: 'Thức Uống',
  //   items: [
  //     { name: 'Trà đá', price: '5,000 VND', image: steak },
  //     { name: 'Cà phê sữa đá', price: '20,000 VND', image: steak },
  //     { name: 'Nước ngọt', price: '10,000 VND', image: steak },
  //     { name: 'Chè ba màu', price: '15,000 VND', image: steak },
  //     { name: 'Bánh flan', price: '10,000 VND', image: steak },
  //   ],
  // },
];

const ListFood = ({ show }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div
      className={`list-food-container ${
        show ? "list-food-enter" : "list-food-exit"
      }`}>
      <div className="listfood-header">
        <h1>LIST FOOD</h1>
        <div className="action-buttons">
         
          <div className="action-buttons">
            <button className="filter-button btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover">Lọc</button>
            <button className="sort-button btn btn-save-form d-flex align-items-center me-5 mb-2 btn btn-hover">Sắp xếp</button>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      {foodCategories.map((category, index) => (
        <div key={index} className="food-category">
          <h3>{category.category}</h3>
          <ul className="food-list">
            {category.items.map((item, idx) => (
              <li key={idx} className="food-item">
                <div className="food-details">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="food-image"
                  />
                  <span className="food-name">{item.name}</span>
                  <span className="food-price">{item.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ListFood;
