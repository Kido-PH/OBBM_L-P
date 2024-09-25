import * as React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Example() {
  const locations = [
    {
      id: "1",
      locationName: "Luxury Hotel",
      locationImage: "https://images.trvl-media.com/lodging/12000000/11090000/11080400/11080372/09a1950c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      locationAddress: "123 Main St, City Center",
      locationPrice: "15,000,000 VND",
    },
    {
      id: "2",
      locationName: "Beach Resort",
      locationImage: "https://images.trvl-media.com/lodging/12000000/11090000/11080400/11080372/09a1950c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      locationAddress: "45 Ocean Drive, Beachfront",
      locationPrice: "20,000,000 VND",
    },
    {
      id: "3",
      locationName: "Mountain Retreat",
      locationImage: "https://images.trvl-media.com/lodging/12000000/11090000/11080400/11080372/09a1950c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      locationAddress: "78 Hillside Rd, Mountains",
      locationPrice: "18,000,000 VND",
    },
    {
      id: "4",
      locationName: "City Banquet Hall",
      locationImage: "https://images.trvl-media.com/lodging/12000000/11090000/11080400/11080372/09a1950c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      locationAddress: "90 Avenue Rd, Downtown",
      locationPrice: "12,000,000 VND",
    },
  ];

  const [lgShow, setLgShow] = React.useState(false);
  const handleClose = () => setLgShow(false);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const handleSelect = (location) => {
    setSelectedLocation(location);
    setLgShow(false);
  };

  return (
    <>
      <div
        className="form-control fs-4"
        onClick={() => setLgShow(true)}
        style={{ cursor: "pointer" }}
      >
        {selectedLocation
          ? selectedLocation.locationName + " - " + selectedLocation.locationPrice
          : "Choose Location"}
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Choose Location</Modal.Title>
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
                  style={{
                    borderRadius: "0.5rem", // Border radius cho nút
                    border: "1px solid #ced4da", // Màu viền (tuỳ chọn)
                  }}
                >
                  Choose Your Location
                </button>
              </Col>
            </Row>

            <Row lg={4} sm={2} xs={1}>
              {locations.map((location, index) => (
                <Col key={index} className="p-2">
                  <Card className="h-100" style={{ width: "100%" }}>
                  <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src={location.locationImage}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fs-2">
                        {location.locationName}
                      </Card.Title>
                      <Card.Text>
                        <p>{location.locationAddress}</p>
                        <h3 className="text-success fw-bold">
                          {location.locationPrice}
                        </h3>
                        {location.locationAddress}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleSelect(location)}
                      >
                        Select
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
    </>
  );
}

export default Example;
