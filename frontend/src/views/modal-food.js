// src/components/Modal.js
import React from 'react';
import '../assets/css/modal-food.css';

const Modal = ({ isOpen, onClose, items, onAdd }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h4>Select a Dish</h4>
        <div className="row">
          {items.map((item, index) => (
            <div key={index} className="col-md-6 dish-item">
              <img src={item.image} alt={item.name} className="img-fluid" />
              <div className="details">
                <div className="name">{item.name}</div>
                <div className="price">{item.price}</div>
                <button className="btn" onClick={() => onAdd(item)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
