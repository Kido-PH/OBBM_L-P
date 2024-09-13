// src/components/MenuSuggest.js
import React, { useState, useEffect } from 'react';
import '../assets/css/menu.css';

const MenuSuggest = ({ menuData, onChooseMenu }) => {
  const [currentMenu, setCurrentMenu] = useState(menuData);

  useEffect(() => {
    setCurrentMenu(menuData);
  }, [menuData]);

  const handleChooseMenu = () => {
    if (onChooseMenu) {
      onChooseMenu(currentMenu);
    }
  };

  return (
    <div className="menu-menu-suggest">
      <h3 className='title-menu-suggest'>Menu Suggest</h3>
      
      {Object.keys(currentMenu).length === 0 ? (
        <p>No menu selected</p>
      ) : (
        Object.keys(currentMenu).map(section => (
          <div key={section} className="menu-suggest-section">
            <h4>{section}</h4>
            <div className="row">
              {currentMenu[section].map((item, index) => (
                <div key={index} className="col-md-6 dish-item">
                  <img src={item.image} alt={item.name} className="img-fluid" />
                  <div className="details">
                    <div className="name">{item.name}</div>
                    <div className="price">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Footer Section */}
      <div className="menu-suggest-footer">
        <button className="btn" onClick={handleChooseMenu}>
          Choose Menu
        </button>
      </div>
    </div>
  );
};

export default MenuSuggest;
