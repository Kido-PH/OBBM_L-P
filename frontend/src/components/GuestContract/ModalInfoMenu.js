import React from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

function ModalInfoMenu({ show, onClose, menuDishes }) {
  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  const categoryList = [1, 2, 3];

  return (
    <Modal show={show} onHide={onClose}>
      <div style={{ width: "420px", margin: "0 auto" }}>
        <button
          className="add-button"
          onClick={onClose}
          style={{ color: "hsl(32, 100%, 59%)" }}
        >
          <FaTimes
            style={{ color: "#341c0e", width: "12px", marginTop: "12px" }}
          />{" "}
        </button>
        <div className="chiTietThucDon m-0">
          <div className="menu-view-control">
            {categoryList.map((categoryId, index) => (
              <div key={index} style={{ marginBottom: "8px" }}>
                <h3>
                  {categoryId === 1
                    ? "Khai vị"
                    : categoryId === 2
                    ? "Món chính"
                    : categoryId === 3
                    ? "Tráng miệng"
                    : "Đồ uống"}
                </h3>
                <ul>
                  {menuDishes.filter((menudish)=>menudish.categories.categoryId===categoryId).map((dish, index) => (
                    <li key={index}>
                      <strong>{dish.name}</strong>{" "}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {menuDishes ? (
            <div style={{ width: "420px", margin: "0 auto" }}>
              <button
                className="add-button"
                onClick={onClose}
                style={{ color: "hsl(32, 100%, 59%)" }}
              >
                <FaTimes
                  style={{ color: "#341c0e", width: "12px", marginTop: "12px" }}
                />{" "}
              </button>
              <div className="chiTietThucDon">

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
          )} */}
    </Modal>
  );
}

export default ModalInfoMenu;
