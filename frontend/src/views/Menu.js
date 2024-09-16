// src/components/Menu.js
import React, { useState } from 'react';
import YourMenu from './YourMenu';
import MenuSuggest from './MenuSuggest';
import AvailableMenu from './AvailableMenu';
import '../assets/css/menu.css';

const Menu = () => {
  const [menuSuggestData, setMenuSuggestData] = useState({});
  const [yourMenuItems, setYourMenuItems] = useState({
    Appetizer: [],
    "Main dishes": [],
    Dessert: [],
    Drinks: [],
  });

  // Cập nhật yourMenuItems khi người dùng chọn menu từ MenuSuggest
  const handleSelectMenu = (menuData) => {
    setMenuSuggestData(menuData);
  };

  // Chuyển dữ liệu từ MenuSuggest sang YourMenu
  const handleChooseMenu = () => {
    setYourMenuItems(prevItems => ({
      ...prevItems,
      ...menuSuggestData
    }));
    setMenuSuggestData({});
  };

  return (
    <div className="menu-container">
      <div className="menu-left">
        <YourMenu 
          menuItems={yourMenuItems}
          onAddItem={(item, section) => {
            setYourMenuItems(prevItems => ({
              ...prevItems,
              [section]: [...prevItems[section], item]
            }));
          }}
        />
        <MenuSuggest 
          menuData={menuSuggestData}
          onChooseMenu={handleChooseMenu} 
        />
      </div>
      <div className="menu-right">
        <AvailableMenu onSelectMenu={handleSelectMenu} />
      </div>
    </div>
  );
};

export default Menu;
