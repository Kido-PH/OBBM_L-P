import * as React from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";

import { useNavigate, useParams } from "react-router-dom";
import guestContractApi from "api/guestContractApi";
import ConfirmCancelModal from "./ModalCancelContract";
import Swal from "sweetalert2";
import ModalInfoMenu from "./ModalInfoMenu";
import PaymentCard from "./PaymentCard";

const ContractInfo = () => {
  const { id } = useParams();
  const [contractInfo, setContractInfo] = React.useState({});

  const navigate = useNavigate();
  const [showModalCancel, setShowModalCancel] = React.useState(false);
  const [showModalMenu, setShowModalMenu] = React.useState(false);
  const [showPaymentCard, setShowPaymentCard] = React.useState(false);

  // Hàm mở modal
  const handleShowModalCancel = () => {
    setShowModalCancel(true);
  };

  // Hàm đóng modal
  const handleCloseModalCancel = () => {
    setShowModalCancel(false);
  };

  const handleShowModalMenu = () => {
    setShowModalMenu(true);
  };

  const handleCloseModalMenu = () => {
    setShowModalMenu(false);
  };

  const handleTogglePaymentCard = () => {
    setShowPaymentCard((prevShowForm) => !prevShowForm);
  };

  const handlePayment = () => {};

  // Hàm xóa hợp đồng và thực đơn
  const handleDeleteContractAndMenu = async () => {
    try {
      // Gọi API xóa hợp đồng
      await guestContractApi.delete(contractInfo.contractId);

      // Gọi API xóa thực đơn
      await guestContractApi.deleteMenu(contractInfo.menus?.menuId);
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Hủy hợp đồng thành công!",
        timer: 2000, // Tự động đóng sau 2 giây
        showConfirmButton: false,
      });

      // Điều hướng về danh sách hợp đồng khi xóa thành công
      navigate("/user/contract-list");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      await Swal.fire({
        icon: "danger",
        title: "Hủy hợp đồng",
        text: "Hủy hợp đồng thất bại!",
        timer: 2000, // Tự động đóng sau 2 giây
        showConfirmButton: true,
      });
    }
  };

  const fetchContractInfo = async () => {
    try {
      const userInfoFetch = await guestContractApi.get(id);
      console.log("Fetch contract thành công", userInfoFetch);
      setContractInfo(userInfoFetch.result);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  React.useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
    import("../../assets/css/mainStyle.css");
    import("../../assets/css/contractGuestStyle.css");

    console.log("Id hứng được:", id);
    fetchContractInfo();
  }, []);

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  return (
    <section
      className="section section-divider white account-section pt-5"
      id="blog"
    >
      <div className="container" style={{ marginTop: "120px" }}>
        <div className="text-center mb-5 fw-bold">
          <h1>Thông tin chi tiết hợp dồng</h1>
        </div>
        <Card name="contractInfo" className="p-5" style={{ opacity: 0.9 }}>
          <h2 style={{ color: "hsl(28, 100%, 58%)" }}>Thông tin hợp đồng</h2>
          <div name="contractForm" className="contractForm">
            <div className="row row-cols-sm-1 row-cols-md-2">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Thực đơn</label>
                  <button
                    className="form-control fs-4 d-flex justify-content-between align-middle"
                    onClick={handleShowModalMenu}
                  >
                    Menu Id
                    <FaEye />
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Địa điểm</label>
                  <button className="form-control fs-4 d-flex justify-content-between align-middle">
                    {contractInfo.locations?.name} -{" "}
                    {contractInfo.locations?.address}
                    <FaEye />
                  </button>
                </div>
              </div>

              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold ">Ngày tổ chức</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.organizdate}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Ghi chú</label>
                  <div className="form-control input-hienthi fs-4 me-2">
                    {contractInfo.description ? (
                      <div>{contractInfo.description}</div>
                    ) : (
                      <div>Không có ghi chú...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-cols-sm-2 row-cols-lg-4">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Sự kiện</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.events?.name}
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Số lượng khách</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.guest}
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Số lượng khách / bàn
                    <span className="text-danger d-inline-block">*</span>
                  </label>
                  <div className="form-control input-hienthi fs-4">
                    {/* {contractInfo.guest} */} số người/bàn
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Số bàn</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.table}
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ color: "var(--dark-orange)" }}>
              Thông Tin Khách Hàng
            </h3>
            <Row lg={3} md={3} xs={1}>
              <Col>
                <div className="mb-3">
                  <label className="form-label fw-bold ">Tên Khách Hàng</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.custname}
                  </div>
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Số Điện Thoại Khách Hàng
                  </label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.custphone}
                  </div>
                </div>
              </Col>
              <Col>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email liên hệ</label>
                  <div className="form-control input-hienthi fs-4">
                    {contractInfo.custmail}
                  </div>
                </div>
              </Col>
            </Row>
            <h3 style={{ color: "var(--dark-orange)" }}>Chi Phí</h3>
            <div className="row row-cols-sm-1 row-cols-lg-3 mt-3">
              <div className="col">
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold mb-0 me-2">
                    Chi phí địa điểm:
                  </label>
                  <span
                    className="fw-bold"
                    style={{ color: "var(--deep-saffron)" }}
                  >
                    {formatCurrency(contractInfo.locations?.cost)} VND
                  </span>
                </div>
              </div>

              <div className="col">
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold mb-0 me-2">
                    Tổng chi phí thực đơn:
                  </label>
                  <span
                    className="fw-bold"
                    style={{ color: "var(--deep-saffron)" }}
                  >
                    {formatCurrency(
                      contractInfo.menus?.totalcost * contractInfo.guest
                    )}{" "}
                    VND
                  </span>
                </div>
              </div>

              <div className="col">
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold mb-0 me-2">
                    Tổng cộng:
                  </label>
                  <span className="text-success fw-bold">
                    {formatCurrency(contractInfo.totalcost)} VND
                  </span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold mb-0 me-2">
                    Đã thanh toán:
                  </label>
                  <span className="text-success fw-bold">
                    {formatCurrency(
                      "0" //sau này tính ở đây
                    )}{" "}
                    VND
                  </span>
                </div>
                <div className="mb-3 d-flex align-items-center">
                  <label className="form-label fw-bold mb-0 me-2">
                    Số tiền còn lại:
                  </label>
                  <span className="text-success fw-bold">
                    {formatCurrency(
                      contractInfo.totalcost //sau này tính ở đây
                    )}{" "}
                    VND
                  </span>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <h3 style={{ color: "var(--dark-orange)" }}>
                Trạng thái hợp đồng:{" "}
                <span
                  className="d-inline-block"
                  style={{
                    color:
                      contractInfo.status === "Pending"
                        ? "var(--sonic-silver)"
                        : contractInfo.status === "Approved"
                        ? "var(--deep-saffron)"
                        : "var(--green-success)",
                  }}
                >
                  {contractInfo.status === "Pending"
                    ? "Chờ xác nhận"
                    : contractInfo.status === "Approved"
                    ? "Đã xác nhận"
                    : "Đã hoàn thành"}
                </span>
              </h3>

              <h3 style={{ color: "var(--dark-orange)" }}>
                Trạng thái thanh toán:{" "}
                <span
                  className="d-inline-block"
                  style={{
                    color:
                      contractInfo.paymentstatus === "Unpaid"
                        ? "var(--sonic-silver)"
                        : contractInfo.paymentstatus === "50%"
                        ? "var(--deep-saffron)"
                        : contractInfo.paymentstatus === "70%"
                        ? "var(--deep-saffron)"
                        : "var(--green-success)",
                  }}
                >
                  {contractInfo.paymentstatus === "Unpaid"
                    ? "Chưa thanh toán"
                    : contractInfo.paymentstatus === "50%"
                    ? "Đã thanh toán 50%"
                    : contractInfo.paymentstatus === "70%"
                    ? "Đã thanh toán 70%"
                    : "Đã thanh toán"}
                </span>
              </h3>
            </div>
          </div>
        </Card>
        <div style={{ textAlign: "center" }}>
          {contractInfo.status === "Pending" && (
            <button
              type="button"
              className="btn btn-save-form btn-huy mx-3"
              style={{ marginTop: "1rem" }}
              onClick={handleShowModalCancel}
            >
              Hủy
            </button>
          )}
          {(contractInfo.paymentstatus === "Unpaid" ||
            contractInfo.paymentstatus === "50%" ||
            contractInfo.paymentstatus === "70%") && (
            <button
              type="button"
              className="btn btn-save-form btn-hover mx-3"
              style={{ marginTop: "1rem" }}
              onClick={handleTogglePaymentCard}
            >
              Thanh Toán
            </button>
          )}
        </div>
        {showPaymentCard && (
          <PaymentCard
            onHide={handlePayment}
            totalCost={contractInfo.totalcost}
          />
        )}
      </div>

      <ConfirmCancelModal
        show={showModalCancel}
        onHide={handleCloseModalCancel}
        onConfirm={handleDeleteContractAndMenu}
      />

      <ModalInfoMenu show={showModalMenu} onClose={handleCloseModalMenu} />
    </section>
  );
};

export default ContractInfo;
