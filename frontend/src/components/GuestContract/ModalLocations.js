import * as React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { multiStepContext } from "../../StepContext";
import guestLocationApi from "../../api/guestLocationApi";
import FormCreateLocation from "./FormLocationCreate";
import ModalDelete from "./ModalDelete";
import FormUpdateLocation from "./FormLocationUpdate";
import AudioRecorder from "./SpeechToTextInput";
import { checkAccessToken } from "services/checkAccessToken";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import guestContractApi from "api/guestContractApi";
import moment from "moment";

function Example({ selectedDate, isLocationCleared }) {
  const { contractData, setContractData } = React.useContext(multiStepContext);

  const currentUserId = JSON.parse(sessionStorage.getItem("currentUserId")); // UserId có thể là chuỗi

  // Tạo ref cho modal
  const modalRef = React.useRef(null);

  const [lgShow, setLgShow] = React.useState(false);
  const [locationList, setLocationList] = React.useState([]);
  const [contractList, setContractList] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const [userLocationShow, setUserLocationShow] = React.useState(false);
  const [showFormCreate, setShowFormCreate] = React.useState(false);
  const [showFormUpdate, setShowFormUpdate] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState(null);
  const [selectedLocationName, setSelectedLocationName] = React.useState(null);
  const [selectedEditLocation, setSelectedEditLocation] = React.useState(null);

  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const navigate = useNavigate();

  // Hàm xử lý nhấn nút sửa
  const handleEditClick = (location) => {
    setSelectedEditLocation(location); // Lưu location vào state
    setShowFormUpdate(true); // Mở form cập nhật
    if (modalRef.current) {
      modalRef.current.scrollTop = 0; // Cuộn modal về đầu
    }
  };

  //fetch dữ liệu mặc định cho
  const fetchLocations = async () => {
    try {
      const List = await guestLocationApi.getPage(1, 1000);

      setLocationList(List.result.content); //set state
      console.log("List fetch:", List);
    } catch (error) {
      checkAccessToken(navigate);
    }
  };

  //fetch dữ liệu mặc định cho
  const fetchContracts = async () => {
    try {
      const List = await guestContractApi.getAll(1, 1000);

      setContractList(List.result.content); //set state
    } catch (error) {
      checkAccessToken(navigate);
    }
  };

  //Delete UserLocation
  const handleDeleteClick = (location) => {
    setSelectedLocationId(location.locationId);
    setSelectedLocationName(location.name);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    fetchLocations(); // Tải lại dữ liệu sau khi xóa thành công
  };

  const handleClose = () => setLgShow(false);

  const userLocationOpen = () => {
    handleClose();
    setUserLocationShow(true);
  };

  const closeModalAll = () => {
    handleClose();
    setUserLocationShow(false);
  };

  const userLocationClose = () => {
    setUserLocationShow(false);
    // await fetchLocations();
    setLgShow(true);
  };

  const handleToggleFormCreate = () => {
    setShowFormCreate((prevShowForm) => !prevShowForm);
  };

  const handleToggleFormUpdate = () => {
    setShowFormUpdate((prevShowForm) => !prevShowForm);
  };

  // Kiểm tra currentLocation trong localStorage khi component mount

  React.useEffect(() => {
    if (!isLocationCleared) {
      const locationData = localStorage.getItem("currentLocation");
      const parsedLocation = locationData ? JSON.parse(locationData) : null;

      // Chỉ cập nhật nếu giá trị thực sự thay đổi
      if (JSON.stringify(parsedLocation) !== JSON.stringify(selectedLocation)) {
        setSelectedLocation(parsedLocation);
      }
    }
  }, [isLocationCleared, selectedLocation]);

  const filteredLocations = locationList?.filter(
    (location) =>
      location.isCustom && location?.users?.userId === String(currentUserId)
  );

  // Hàm chọn location và lưu vào localStorage
  const handleSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("currentLocation", JSON.stringify(location)); // Lưu vào localStorage
    setContractData({
      ...contractData,
      locationId: location.locationId,
      guest: 0,
      table: 0,
    });
    closeModalAll();
  };

  const handleSearch = (value) => {
    if (!value.trim()) {
      setIsSearching(false); // Nếu chuỗi rỗng, quay về danh sách gốc
      return;
    }
    const results = locationFilteredByTime.filter((location) =>
      location.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const locationFilteredByTime = locationList.filter((location) => {
    if (location.isCustom) {
      // Nếu isCustom === true thì bỏ qua phần tử này
      return false;
    }

    const isValidContract = !location.listContract.some((contract) => {
      // Chuyển selectedDate và organizdate sang Moment object
      const selectedDateObj = moment(selectedDate, "DD/MM/YYYY HH:mm");
      const organizDateObj = moment(contract.organizdate, "DD/MM/YYYY HH:mm");

      // Tính khoảng cách thời gian giữa selectedDate và organizdate (theo giờ)
      const timeDifference = Math.abs(
        selectedDateObj.diff(organizDateObj, "hours")
      );

      return (
        contract.paymentstatus !== "Unpaid" && // paymentstatus khác "Unpaid"
        (contract.status === "Actived" || contract.status === "Approved") && // status là "Pending" hoặc "Actived"
        timeDifference <= 2 // organizdate trong phạm vi 2 giờ của selectedDate
      );
    });

    // Chỉ gán vào mảng nếu không có hợp đồng nào thỏa điều kiện
    return isValidContract;
  });

  const locationsToDisplay = isSearching
    ? searchResults
    : locationFilteredByTime;

  const formatCurrency = (amount) => {
    return amount
      ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "0";
  };

  const showModalPopup = () => {
    if (selectedDate !== undefined) {
      setIsSearching(false);
      setLgShow(true);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn Ngày tổ chức trước",
        timer: 3000, // Tự động đóng sau 8 giây
        showConfirmButton: true,
      });
    }
  };

  React.useEffect(() => {
    console.log("Updated contractData:", contractData);
  }, [contractData]);

  const getCardStyle = (location) => {
    return selectedLocation &&
      selectedLocation.locationId === location.locationId
      ? {
          width: "100%",
          backgroundColor:
            "rgba(255, 147, 25, 0.1)" /* thêm thuộc tính khác nếu cần */,
          boxshadow: "0 2px 10px rgba(0, 0, 0, 1)",
        }
      : { width: "100%" /* các thuộc tính mặc định khác */ };
  };

  React.useEffect(() => {
    fetchLocations();
    fetchContracts();
  },[]);

  return (
    <>
      <div
        className="form-control fs-4 input-hienthi-popup"
        onClick={showModalPopup}
        style={{ cursor: "pointer" }}
      >
        <div className="row">
          <div className="col-5">
            <p
              className="mb-0"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedLocation
                ? selectedLocation?.name + " - "
                : "Chọn địa điểm"}
            </p>
          </div>
          <div className="col-3 text-center">
            <p
              className="mb-0"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedLocation === null
                ? ""
                : selectedLocation?.capacity === null
                ? selectedLocation?.address
                : "Sức chứa: " + selectedLocation?.capacity}
            </p>
          </div>
          <div className="col-4">
            <p
              className="mb-0"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedLocation === null
                ? ""
                : selectedLocation?.capacity === null
                ? ""
                : "Địa chỉ: " + selectedLocation?.address}
            </p>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Chọn sảnh có sẵn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row
              lg={2}
              sm={2}
              className="d-flex align-items-center justify-content-between"
            >
              <Col className="p-2">
                <div className="input-group input-group-sm">
                  <AudioRecorder onSearch={handleSearch} />
                </div>
              </Col>
              <Col className="text-end">
                {" "}
                {/* Thêm class text-end */}
                <button
                  variant="outline-secondary"
                  className="btn btn-modal-search"
                  onClick={userLocationOpen}
                  style={{
                    borderRadius: "0.5rem", // Border radius cho nút
                    border: "1px solid #ced4da", // Màu viền (tuỳ chọn)
                  }}
                >
                  Địa điểm của tôi
                </button>
              </Col>
            </Row>

            <Row lg={3} sm={2} xs={1}>
              {locationsToDisplay.length === 0 ? (
                <div className="w-100 text-center py-4 fs-4">
                  Không có địa điểm bạn tìm
                </div>
              ) : (
                locationsToDisplay.map((location, index) => (
                  <Col key={index} className="p-2">
                    <Card
                      className="h-100 card-select"
                      style={getCardStyle(location)}
                    >
                      <Card.Img
                        variant="top"
                        style={{ maxWidth: "300px", height: 150 }}
                        src={location.image}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fs-2">
                          {location.name}
                        </Card.Title>
                        <div className="my-3">
                          <div className="fw-bold fs-3">
                            Sức chứa: {location.capacity} người
                          </div>
                          <div className="text-success fw-bold fs-3">
                            {formatCurrency(location.cost)} VND
                          </div>
                          <div>{location.address}</div>{" "}
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => handleSelect(location)}
                          className="mt-auto"
                        >
                          {selectedLocation &&
                          selectedLocation.locationId === location.locationId
                            ? "Đã chọn"
                            : "Chọn"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal địa điểm riêng của khách hàng */}
      <Modal
        size="lg"
        show={userLocationShow}
        onHide={userLocationClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Địa điểm của bạn</Modal.Title>
        </Modal.Header>
        <Modal.Body ref={modalRef}>
          <Container>
            <Row lg={2} sm={2} className="d-flex align-items-center">
              <Col className="p-2">
                <div className="input-group input-group-sm">
                  <input
                    className="fs-4 form-control"
                    placeholder="Tìm kiếm địa điểm của bạn"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: "0.5rem", // Border radius cho ô input
                      border: "1px solid #ced4da", // Màu viền (tuỳ chọn)
                    }}
                  />
                  <button
                    variant="outline-secondary"
                    className="btn btn-modal-search"
                    style={{
                      borderRadius: "0.5rem", // Border radius cho nút
                      border: "1px solid #ced4da", // Màu viền (tuỳ chọn)
                    }}
                  >
                    <CiSearch size={24} />
                  </button>
                </div>
              </Col>
              <Col>
                <button
                  variant="outline-secondary"
                  className="btn btn-modal-search"
                  onClick={handleToggleFormCreate}
                  style={{
                    borderRadius: "0.5rem", // Border radius cho nút
                    border: "1px solid #ced4da", // Màu viền (tuỳ chọn)
                  }}
                >
                  Thêm mới
                </button>
              </Col>
            </Row>
            <div>
              {showFormCreate && (
                <FormCreateLocation
                  onClose={handleToggleFormCreate}
                  onAddLocation={fetchLocations}
                />
              )}
              {showFormUpdate && selectedEditLocation && (
                <FormUpdateLocation
                  locationData={selectedEditLocation}
                  onClose={handleToggleFormUpdate}
                  onUpdateLocation={fetchLocations}
                />
              )}{" "}
            </div>

            {filteredLocations // Lọc các phần tử có isCustom = false
              .map((location, index) => (
                <Card
                  className="my-3 card-select card-location"
                  style={getCardStyle(location)}
                  key={index}
                >
                  <Row>
                    <Col
                      key={index}
                      className="p-2"
                      xs={11}
                      onClick={() => handleSelect(location)}
                    >
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fs-3">
                          {location.name}
                        </Card.Title>
                        <Card.Text>
                          <div>Địa chỉ: {location.address}</div>
                        </Card.Text>
                      </Card.Body>
                    </Col>
                    <Col
                      xs={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Button
                        variant=""
                        className="btn-sua me-2"
                        onClick={() => handleEditClick(location)}
                      >
                        <FaEdit size={14} />
                      </Button>
                      <Button
                        variant=""
                        className="btn-xoa"
                        onClick={() => handleDeleteClick(location)}
                      >
                        <FaRegTrashAlt size={14} />
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={userLocationClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalDelete
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        locationId={selectedLocationId}
        onDeleteSuccess={handleDeleteSuccess}
        name={selectedLocationName}
      />
    </>
  );
}

export default Example;
