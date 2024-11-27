import React from "react";
import { Modal, Button, Row, Col, Image } from "react-bootstrap";

function ModalInfoMenu({ show, onClose, menuDishes }) {
  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };
  return (
    <Modal show={show} onHide={onClose} size="md">
      <div
        style={{
          backgroundImage: "url(/images/menu/menu-background.jpg)",
          backgroundSize: "cover", // Đảm bảo hình ảnh phủ toàn bộ
          backgroundPosition: "center", // Căn giữa hình ảnh
          backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
        }}
      >
        <Modal.Body className="p-0">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className="mt-5 mb-4 fw-bold menu-contract-font">Thực đơn của bạn</h1>
          </div>
          <div className="d-flex flex-column align-items-center text-center">
            <div className="mb-3">
              <div className="mb-3 fs-2 fw-bold menu-contract-font">Khai vị</div>
              <Row lg={4} md={3} xs={2}>
                {menuDishes
                  .filter((menuDish) => menuDish?.categories.categoryId === 1)
                  .map((menuDish, index) => (
                    <Col
                      key={index}
                      className="p-2 d-inline-flex flex-column align-items-center text-center"
                      style={{ width: "auto" }} // Để cột tự động điều chỉnh kích thước
                    >
                      <img
                        src={menuDish.image}
                        alt={menuDish.name}
                        style={{
                          maxWidth: "80px", // Hoặc thay đổi theo yêu cầu
                          height: "65px",
                          borderRadius: 10,
                        }}
                      />
                      <div className="fs-4 w-100 text-center fw-bold">
                        {menuDish.name}
                      </div>
                      <div className="text-success fs-4 w-100 fw-bold text-center">
                        {formatCurrency(menuDish.price)} VND
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>

            <div className="mb-3 fs-2 fw-bold menu-contract-font">Món chính</div>
            <Row lg={4} md={3} xs={2}>
              {menuDishes
                .filter((menuDish) => menuDish?.categories.categoryId === 2)
                .map((menuDish, index) => (
                  <Col
                    key={index}
                    className="p-2 d-inline-flex flex-column align-items-center text-center"
                    style={{ width: "auto" }} // Để cột tự động điều chỉnh kích thước
                  >
                    <img
                      src={menuDish.image}
                      alt={menuDish.name}
                      style={{
                        maxWidth: "80px", // Hoặc thay đổi theo yêu cầu
                        height: "65px",
                        borderRadius: 10,
                      }}
                    />
                    <div className="fs-4 w-100 text-center fw-bold">
                      {menuDish.name}
                    </div>
                    <div className="text-success fs-4 w-100 fw-bold text-center">
                      {formatCurrency(menuDish.price)} VND
                    </div>
                  </Col>
                ))}
            </Row>

            <div className="mb-3 fs-2 fw-bold menu-contract-font">Tráng miệng</div>
            <Row lg={4} md={3} xs={2}>
              {menuDishes
                .filter((menuDish) => menuDish?.categories.categoryId === 3)
                .map((menuDish, index) => (
                  <Col
                    key={index}
                    className="p-2 d-inline-flex flex-column align-items-center text-center"
                    style={{ width: "auto" }} // Để cột tự động điều chỉnh kích thước
                  >
                    <img
                      src={menuDish.image}
                      alt={menuDish.name}
                      style={{
                        maxWidth: "80px", // Hoặc thay đổi theo yêu cầu
                        height: "65px",
                        borderRadius: 10,
                      }}
                    />
                    <div className="fs-4 w-100 text-center fw-bold">
                      {menuDish.name}
                    </div>
                    <div className="text-success fs-4 w-100 fw-bold text-center">
                      {formatCurrency(menuDish.price)} VND
                    </div>
                  </Col>
                ))}
            </Row>

            <div className="mb-3 fs-2 fw-bold menu-contract-font">Khác</div>
            <Row lg={4} md={3} xs={2}>
              {menuDishes
                .filter(
                  (menuDish) =>
                    menuDish?.categories.categoryId !== 1 &&
                    menuDish?.categories.categoryId !== 2 &&
                    menuDish?.categories.categoryId !== 3
                )
                .map((menuDish, index) => (
                  <Col
                    key={index}
                    className="p-2 d-inline-flex flex-column align-items-center text-center"
                    style={{ width: "auto" }} // Để cột tự động điều chỉnh kích thước
                  >
                    <img
                      src={menuDish.image}
                      alt={menuDish.name}
                      style={{
                        maxWidth: "80px", // Hoặc thay đổi theo yêu cầu
                        height: "65px",
                        borderRadius: 10,
                      }}
                    />
                    <div className="fs-4 w-100 text-center fw-bold">
                      {menuDish.name}
                    </div>
                    <div className="text-success fs-4 w-100 fw-bold text-center">
                      {formatCurrency(menuDish.price)} VND
                    </div>
                  </Col>
                ))}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            variant="secondary"
            className="btn-modal-delete-huy mx-2"
            onClick={onClose}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default ModalInfoMenu;
