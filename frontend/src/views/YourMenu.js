// src/components/YourMenu.js
import React, { useState } from 'react';
import '../assets/css/menu.css';
import Modal from './modal-food'; // Cập nhật tên file nếu cần

const YourMenu = ({ menuItems, onAddItem }) => {
  const [modalData, setModalData] = useState(null);
  const [currentSection, setCurrentSection] = useState('');

  const openModal = (section, items) => {
    setCurrentSection(section);
    setModalData(items);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="menu-your-menu">
      <h3 className='title-your-menu'>Your Menu</h3>

      {Object.keys(menuItems).map(section => (
        <div key={section} className="menu-your-menu-section">
          <div className="section-header">
            <h4>{section}</h4>
            <button 
              className="add-btn"
              onClick={() => openModal(section, menuItems[section])}
            >
              +
            </button>
          </div>
          <div className="row">
            {menuItems[section].map((item, index) => (
              <div key={index} className="col-md-6 dish-item">
                <img src={item.image} alt={item.name} className="img-fluid" />
                <div className="details">
                  <div className="name">{item.name}</div>
                  <div className="price">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
          {modalData && (
            <Modal 
              isOpen={!!modalData}
              onClose={closeModal}
              items={modalData}
              onAdd={item => {
                onAddItem(item, currentSection);
                closeModal();
              }}
            />
          )}
        </div>
      ))}

      {/* Footer Section */}
      <div className="menu-your-menu-footer">
        <button className="btn" style={{ marginRight: '10px' }}>
          View Menu
        </button>
        <button className="btn" style={{ marginLeft: '10px' }}>
          Create Menu
        </button>
      </div>
    </div>
  );
};

export default YourMenu;
