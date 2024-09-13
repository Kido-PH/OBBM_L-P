// src/components/AvailableMenu.js
import React from 'react';
import '../assets/css/menu.css';
import food from '../assets/images/food-menu-2.png';

const AvailableMenu = ({ onSelectMenu }) => {
  const menuData = {
    'VietNam menu': {
      Appetizer: [
        { name: "Pho", price: "50.000đ", image: food },
        { name: "Banh Mi", price: "20.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Bun Cha", price: "70.000đ", image: food },
        { name: "Com Tam", price: "60.000đ", image: food }
      ],
      Dessert: [
        { name: "Che Ba Ba", price: "30.000đ", image: food },
        { name: "Banh Flan", price: "25.000đ", image: food }
      ],
    },
    'Italian menu': {
      Appetizer: [
        { name: "Bruschetta", price: "45.000đ", image: food },
        { name: "Caprese Salad", price: "55.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Pizza Margherita", price: "120.000đ", image: food },
        { name: "Pasta Carbonara", price: "100.000đ", image: food }
      ],
      Dessert: [
        { name: "Tiramisu", price: "70.000đ", image: food },
        { name: "Gelato", price: "60.000đ", image: food }
      ],
    },
    'Chinese menu': {
      Appetizer: [
        { name: "Spring Rolls", price: "35.000đ", image: food },
        { name: "Dumplings", price: "40.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Kung Pao Chicken", price: "80.000đ", image: food },
        { name: "Sweet and Sour Pork", price: "75.000đ", image: food }
      ],
      Dessert: [
        { name: "Mango Pudding", price: "45.000đ", image: food },
        { name: "Fortune Cookies", price: "30.000đ", image: food }
      ],
    },
    'Japanese menu': {
      Appetizer: [
        { name: "Edamame", price: "40.000đ", image: food },
        { name: "Miso Soup", price: "30.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Sushi Roll", price: "90.000đ", image: food },
        { name: "Ramen", price: "85.000đ", image: food }
      ],
      Dessert: [
        { name: "Mochi", price: "50.000đ", image: food },
        { name: "Matcha Cake", price: "65.000đ", image: food }
      ],
    },
    'Mexican menu': {
      Appetizer: [
        { name: "Guacamole", price: "45.000đ", image: food },
        { name: "Nachos", price: "50.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Tacos", price: "60.000đ", image: food },
        { name: "Enchiladas", price: "70.000đ", image: food }
      ],
      Dessert: [
        { name: "Churros", price: "40.000đ", image: food },
        { name: "Flan", price: "35.000đ", image: food }
      ],
    },
    'Indian menu': {
      Appetizer: [
        { name: "Samosa", price: "50.000đ", image: food },
        { name: "Pakora", price: "45.000đ", image: food }
      ],
      "Main dishes": [
        { name: "Butter Chicken", price: "90.000đ", image: food },
        { name: "Palak Paneer", price: "80.000đ", image: food }
      ],
      Dessert: [
        { name: "Gulab Jamun", price: "55.000đ", image: food },
        { name: "Rasgulla", price: "50.000đ", image: food }
      ],
    }
  };

  const handleViewClick = (menuName) => {
    const data = menuData[menuName];
    if (onSelectMenu) {
      onSelectMenu(data);
    }
  };

  return (
    <div className="small-menus">
      {Object.keys(menuData).map(menuName => (
        <div key={menuName} className="small-menu">
          <h4>{menuName}</h4>
          <button 
            className="btn color-btn" 
            onClick={() => handleViewClick(menuName)}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default AvailableMenu;
