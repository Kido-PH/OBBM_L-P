import React, { useState } from "react";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import PrivacyPolicyModal from "./PrivacyPolicyModal"; // Import Modal từ file riêng

function PaymentCard({ totalCost }) {
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentPercentage, setPaymentPercentage] = useState(50); // Mặc định là 50%
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị Modal
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false); // Checkbox trạng thái

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  const handleBankChange = (value) => {
    setSelectedBank(value);
  };

  const handlePaymentChange = (e) => {
    setPaymentPercentage(parseInt(e.target.value));
  };

  const calculatedPayment = (totalCost * paymentPercentage) / 100;

  const handleModalToggle = () => setShowModal((prev) => !prev);

  const handlePrivacyChange = (e) => {
    setIsPrivacyChecked(e.target.checked);
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Card
        className="my-3 px-5 pb-5"
        style={{ textAlign: "center", width: "100%", maxWidth: "500px" }}
      >
        <h1 className="my-4 mb-5">Chọn hình thức thanh toán</h1>
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          Tổng giá trị hợp đồng:{" "}
          <span style={{ color: "var(--dark-orange)" }}>
            {formatCurrency(totalCost)} VND
          </span>
        </h2>
        {/* Combo Box */}
        <Row style={{ marginTop: 10 }}>
          <Col xs={5} style={{ paddingRight: 0 }}>
            <Form.Label className="fs-4 mt-2 fw-bold">
              Lựa chọn thanh toán:
            </Form.Label>
          </Col>
          <Col xs={7} style={{ paddingLeft: 0 }}>
            <Form.Select
              value={paymentPercentage}
              onChange={handlePaymentChange}
              className="fs-4 w-100"
            >
              <option value={50}>Trả trước 50%</option>
              <option value={70}>Trả trước 70%</option>
              <option value={100}>Thanh toán toàn bộ</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Radio Buttons */}
        <Row className="mt-4">
          <Col xs={6} className="d-flex justify-content-center">
            <label
              className={`bank-option ${
                selectedBank === "vnpay" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={selectedBank === "vnpay"}
                onChange={() => handleBankChange("vnpay")}
                style={{ display: "none" }}
              />
              <div className="bank-content">
                <img src="/images/logo-contract/logo-vnpay.jpg" alt="VN Pay" />
                <p>VN Pay</p>
              </div>
            </label>
          </Col>
          <Col xs={6} className="d-flex justify-content-center">
            <label
              className={`bank-option ${
                selectedBank === "vietqr" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="vietqr"
                checked={selectedBank === "vietqr"}
                onChange={() => handleBankChange("vietqr")}
                style={{ display: "none" }}
              />
              <div className="bank-content">
                <img
                  src="/images/logo-contract/logo-vietqr.jpg"
                  alt="Viet QR"
                />
                <p>Viet QR</p>
              </div>
            </label>
          </Col>
        </Row>

        {/* Số tiền thanh toán */}
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.6rem"
          }}
        >
          Số tiền thanh toán:{" "}
          <span style={{ color: "var(--dark-orange)" }}>
            {formatCurrency(calculatedPayment)} VND
          </span>
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Căn giữa theo chiều ngang
            textAlign: "center", // Căn giữa nội dung trong label và span
            marginTop: "1.2rem",
          }}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            id="privacyPolicy"
            onChange={handlePrivacyChange}
            style={{
              marginRight: "8px", // Khoảng cách giữa checkbox và label
              width: "20px", // Kích thước chiều rộng của checkbox
              height: "20px", // Kích thước chiều cao của checkbox
              flexShrink: 0, // Không thu nhỏ checkbox
            }}
          />
          {/* Label */}
          <label
            htmlFor="privacyPolicy"
            style={{
              display: "inline-flex", // Sử dụng inline-flex để label và span nằm cùng hàng
              alignItems: "center", // Căn giữa nội dung trong label
              cursor: "pointer",
            }}
          >
            Tôi đồng ý với{" "}
            <span
              onClick={(e) => {
                e.preventDefault(); // Ngăn load lại trang
                handleModalToggle(); // Hiển thị modal
              }}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                marginLeft: "4px", // Khoảng cách giữa "Tôi đồng ý với" và "Chính sách"
              }}
            >
              Điều khoản và chính sách
            </span>
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <Button
            className="mt-4 btn btn-secondary btn-hover w-25"
            disabled={!selectedBank || !isPrivacyChecked}
            // onClick={checkDulieuGuiDi}
          >
            Thanh Toán
          </Button>
        </div>
      </Card>

      {/* Modal */}
      <PrivacyPolicyModal show={showModal} handleClose={handleModalToggle} />
    </Container>
  );
}

export default PaymentCard;
