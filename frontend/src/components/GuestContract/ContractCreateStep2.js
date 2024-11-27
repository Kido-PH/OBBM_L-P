import * as React from "react";
import moment from "moment";
import { Form, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";
import { multiStepContext } from "../../StepContext";
import ModalLocations from "./ModalLocations";
import ModalServices from "./ModalServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalInfoMenu from "./ModalInfoMenu";
import eventApi from "api/eventApi";

const ContractCreateStep2 = () => {
  const { setStep, contractData, setContractData } =
    React.useContext(multiStepContext);
  const location = JSON.parse(localStorage.getItem("currentLocation")); // Parse chuỗi JSON thành đối tượng
  const servicesStored = JSON.parse(
    localStorage.getItem("currentEventServices")
  ); // Parse chuỗi JSON thành đối tượng
  const currentEventId = JSON.parse(localStorage.getItem("currentEventId")); // Parse chuỗi JSON thành đối tượng
  const createdMenu = JSON.parse(localStorage.getItem("createdMenu")); // Parse chuỗi JSON thành đối tượng
  
  const [currentEventInfo, setCurrentEventInfo] = React.useState({});

  const [totalMenuCost, setTotalMenuCost] = React.useState(0);
  const [totalServicesCost, setTotalServicesCost] = React.useState(0);

  const [guestPerTable, setGuestPerTable] = React.useState(10);
  const [showModalMenu, setShowModalMenu] = React.useState(false);

  // const getCurrentMenuDishes = () => {
  //   const dishes = localStorage.getItem("currentMenuDishes");
  //   return dishes ? JSON.parse(dishes) : [];
  // };

  const fetchEvent = async () => {
    const currentEvent = await eventApi.get(currentEventId);
    setCurrentEventInfo(currentEvent.result);
  };

  const handleShowModalMenu = () => {
    setShowModalMenu(true);
  };

  const handleCloseModalMenu = () => {
    setShowModalMenu(false);
  };

  const handleUpdateTotalCost = (newTotal) => {
    setTotalServicesCost(newTotal);
  };

  React.useEffect(() => {
    const guestCount = parseInt(contractData.guest) || 0; // Số khách mặc định là 0 nếu không nhập
    const guestPerTableLocal = guestPerTable || 1; // Số khách trên một bàn mặc định là 1
    const tableCount = Math.ceil(guestCount / guestPerTableLocal); // Chia cho số khách trên một bàn và làm tròn lên
    setContractData((prevData) => ({
      ...prevData,
      table: tableCount,
    }));
  }, [contractData.guest, guestPerTable, setContractData]); // Theo dõi khi `guest` hoặc `guestPerTable` thay đổi

  React.useEffect(() => {
    const guestCount = parseInt(contractData.guest) || 0;
    const menuCost = parseInt(createdMenu.totalcost);

    //set total cost của contract
    const totalMenuCost = menuCost * guestCount;
    setTotalMenuCost(totalMenuCost);

    const totalCost =
      totalMenuCost + parseInt(location?.cost ?? 0) + totalServicesCost;

    setContractData((prevData) => ({
      ...prevData,
      totalcost: totalCost,
      locationId: location?.locationId,
    }));

    console.log("Cập nhật totalCost:", totalCost);
    console.log("contractData sau khi cập nhật totalCost:", {
      ...contractData,
      totalCost: totalCost,
    });
  }, [contractData.guest, setContractData, location?.cost, totalServicesCost]);

  React.useEffect(() => {
    fetchEvent();
  }, []);

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  const handleDateChange = (date) => {
    if (date) {
      // Kiểm tra nếu ngày hợp lệ và thêm thời gian mặc định nếu cần
      const dateWithDefaultTime = new Date(date);
      if (
        dateWithDefaultTime.getHours() === 0 &&
        dateWithDefaultTime.getMinutes() === 0
      ) {
        dateWithDefaultTime.setHours(11, 0, 0, 0);
      }

      const formattedDate =
        moment(dateWithDefaultTime).format("DD/MM/YYYY HH:mm");
      setContractData({
        ...contractData,
        organizdate: formattedDate,
      });
    } else {
      console.error("Ngày không hợp lệ:", date);
    }
  };

  const handleGuestChange = (e) => {
    // Lấy giá trị từ input và chuyển sang số
    const value = parseInt(e.target.value) || 0;

    // Kiểm tra nếu giá trị là số âm
    if (value < 0) {
      // Nếu là số âm, không làm gì hoặc đặt lại giá trị thành 0
      setContractData({
        ...contractData,
        guest: 0, // Hoặc bạn có thể giữ lại giá trị cũ nếu cần
      });
    } else {
      // Giới hạn giá trị tối đa là 10,000 và cập nhật giá trị
      setContractData({
        ...contractData,
        guest: Math.min(value, 10000),
      });
    }
  };

  const isFormValid =
    guestPerTable !== undefined &&
    contractData.guest !== undefined &&
    contractData.guest > 10 &&
    contractData.locationId !== undefined &&
    contractData.organizdate !== undefined;

  return (
    <div>
      <Card className="card p-5 w-100 mt-5">
        <div className="text-center mb-5">
          <h1>Bước 2: Chọn nội dung hợp đồng</h1>
        </div>

        <Form name="contractForm" className="contractForm">
          <div className="row row-cols-sm-1 row-cols-md-2">
            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Thực đơn</label>
                <button
                  id="menuId"
                  name="menuId"
                  aria-label="Menu:"
                  className="form-control fs-4 d-flex justify-content-between align-middle"
                  onClick={handleShowModalMenu}
                >
                  Thực đơn của bạn
                  <FaEye />
                </button>
              </div>

              <div className="row row-cols-md-2 mb-3">
                <div className="col">
                  <label className="form-label fw-bold">
                    Địa điểm
                    <span className="text-danger d-inline-block">*</span>
                  </label>
                  <div className="d-flex align-items-center">
                    <ModalLocations />
                  </div>
                </div>
                <div className="col">
                  <label className="form-label fw-bold">
                    Dịch vụ đi kèm
                    <span className="text-danger d-inline-block">*</span>
                  </label>
                  <div className="d-flex align-items-center">
                    <ModalServices onUpdateTotalCost={handleUpdateTotalCost} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold" htmlFor="organizdate">
                  Ngày tổ chức
                  <span className="text-danger d-inline-block">*</span>
                </label>
                <div className="d-flex">
                  <DatePicker
                    selected={
                      contractData.organizdate
                        ? moment(
                            contractData.organizdate,
                            "DD/MM/YYYY HH:mm"
                          ).toDate()
                        : null
                    }
                    onChange={handleDateChange}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeFormat="HH:mm"
                    minDate={new Date()}
                    required
                    className="form-control fs-4 w-100"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Ghi chú</label>
                <input
                  className="form-control fs-4 me-2"
                  value={contractData["description"]}
                  onChange={(e) => {
                    setContractData({
                      ...contractData,
                      description: e.target.value,
                    });
                  }}
                  placeholder="Nhập ghi chú..."
                ></input>
              </div>
            </div>
          </div>

          <div className="row row-cols-sm-2 row-cols-lg-4">
            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Sự kiện</label>
                <div
                  name="table"
                  id="table"
                  className="form-control input-hienthi fs-4"
                >
                  {currentEventInfo?.name}
                </div>
              </div>
            </div>

            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Số lượng khách ước tính
                  <span className="text-danger d-inline-block">*</span>
                </label>
                <input
                  type="number"
                  name="guest"
                  id="guest"
                  placeholder="Số lượng khách"
                  className="form-control fs-4"
                  value={contractData["guest"]}
                  onChange={handleGuestChange}
                  required
                />
              </div>
            </div>
            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Số lượng khách / bàn
                  <span className="text-danger d-inline-block">*</span>
                </label>
                <select
                  name="guestPerTable"
                  id="guestPerTable"
                  className="form-select fs-4"
                  value={guestPerTable}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setGuestPerTable(value); // Chỉ cập nhật state nếu giá trị hợp lệ
                    }
                  }}
                  required
                >
                  <option value={6}>6 người/bàn</option>
                  <option value={8}>8 người/bàn</option>
                  <option value={10}>10 người/bàn</option>
                </select>
              </div>
            </div>

            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Số bàn</label>
                <div
                  type="number"
                  name="table"
                  id="table"
                  className="form-control input-hienthi fs-4"
                  readOnly // Để chỉ đọc
                  required
                >
                  {contractData["table"]}
                </div>
              </div>
            </div>
          </div>

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
                  {formatCurrency(location?.cost)} VND
                </span>
              </div>
            </div>

            <div className="col">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label fw-bold mb-0 me-2">
                  Tổng chi phí dịch vụ:
                </label>
                <span
                  className="fw-bold"
                  style={{ color: "var(--deep-saffron)" }}
                >
                  {formatCurrency(totalServicesCost)} VND
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
                  {formatCurrency(totalMenuCost)} VND
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label fw-bold mb-0 me-2">Tổng cộng:</label>
              <span className="text-success fw-bold">
                {formatCurrency(contractData.totalcost)} VND
              </span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-save-form mx-3"
              onClick={() => setStep(1)}
              style={{ margin: "10px auto" }}
            >
              Trở về
            </button>
            <button
              type="button"
              className="btn btn-save-form mx-2"
              onClick={() => setStep(3)}
              style={{ margin: "10px auto" }}
              disabled={!isFormValid}
            >
              Tiếp theo
            </button>
          </div>
        </Form>
      </Card>
      {/* <ModalInfoMenu show={showModalMenu} onClose={handleCloseModalMenu} /> */}
    </div>
  );
};

export default ContractCreateStep2;
