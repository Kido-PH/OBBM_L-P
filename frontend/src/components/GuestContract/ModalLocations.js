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

function Example() {
  const { contractData, setContractData } = React.useContext(multiStepContext);

  const currentUserId = JSON.parse(sessionStorage.getItem("currentUserId")); // UserId có thể là chuỗi

  // Tạo ref cho modal
  const modalRef = React.useRef(null);

  const [lgShow, setLgShow] = React.useState(false);
  const [locationList, setLocationList] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [userLocationShow, setUserLocationShow] = React.useState(false);
  const [showFormCreate, setShowFormCreate] = React.useState(false);
  const [showFormUpdate, setShowFormUpdate] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState(null);
  const [selectedLocationName, setSelectedLocationName] = React.useState(null);
  const [selectedEditLocation, setSelectedEditLocation] = React.useState(null);

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
    const List = await guestLocationApi.getPage(1, 100);

    setLocationList(List.result.content); //set state
    console.log("List fetch:", List);
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
    setUserLocationShow(false);
    setLgShow(false);
  };

  const userLocationClose = async () => {
    setUserLocationShow(false);
    await fetchLocations();
    setLgShow(true);
  };

  const handleToggleFormCreate = () => {
    setShowFormCreate((prevShowForm) => !prevShowForm);
  };

  const handleToggleFormUpdate = () => {
    setShowFormUpdate((prevShowForm) => !prevShowForm);
  };

  // Kiểm tra currentLocation trong localStorage khi component mount
  const [selectedLocation, setSelectedLocation] = React.useState(() => {
    const savedLocation = localStorage.getItem("currentLocation");
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  const filteredLocations = locationList.filter(
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
    });
    closeModalAll();
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
  }, []);

  return (
    <>
      <div
        className="form-control fs-4"
        onClick={() => setLgShow(true)}
        style={{ cursor: "pointer" }}
      >
        <p
          className="mb-0"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedLocation
            ? selectedLocation.name + " - " + selectedLocation.address
            : "Chọn địa điểm"}
        </p>
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
        
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Chọn địa điểm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row lg={2} sm={2} className="d-flex align-items-center">
              <Col className="p-2">
                <div className="input-group input-group-sm">
                  <input
                    className="fs-4 form-control"
                    placeholder="Search Location"
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
              {locationList
                .filter((location) => !location.isCustom) // Lọc các phần tử có isCustom = false
                .map((location, index) => (
                  <Col key={index} className="p-2">
                    <Card
                      className="h-100 card-select"
                      style={getCardStyle(location)}
                    >
                      <Card.Img
                        variant="top"
                        style={{ maxWidth: "200px" }}
                        src={location.locationImage}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fs-2">
                          {location.name}
                        </Card.Title>
                        <Card.Text>
                          <p>{location.address}</p>
                          <h3 className="text-success fw-bold">
                            {location.cost} VND
                          </h3>
                          <p>Sức chứa: {location.capacity}</p>
                          {/* <p>{location.description}</p> */}
                        </Card.Text>
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
                ))}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
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
                    placeholder="Search Location"
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
                  className="my-3 card-select"
                  style={getCardStyle(location)}
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
                          <p>Địa chỉ: {location.address}</p>
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
            Close
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
