import * as React from "react";
import {
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function Example() {
  const events = [
    {
      id: "1",
      eventName: "Wedding Party",
      eventImage:
        "https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg",
      eventPrice: "5,000,000 VND",
      eventDescription:
        "A memorable wedding party with a luxurious setting and delightful food.",
    },
    {
      id: "2",
      eventName: "Birthday Celebration",
      eventImage:
        "https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg",
      eventPrice: "3,500,000 VND",
      eventDescription:
        "A fun-filled birthday party with delicious cakes and entertainment.",
    },
    {
      id: "3",
      eventName: "Corporate Event",
      eventImage:
        "https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg",
      eventPrice: "8,000,000 VND",
      eventDescription:
        "Professional corporate gathering with top-notch services and facilities.",
    },
    {
      id: "4",
      eventName: "Charity Gala",
      eventImage:
        "https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg",
      eventPrice: "10,000,000 VND",
      eventDescription:
        "A prestigious charity gala aimed at fundraising with elegant surroundings.",
    },
  ];

  const [lgShow, setLgShow] = React.useState(false);
  const handleClose = () => setLgShow(false);

  const [searchTerm, setSearchTerm] = React.useState("");

  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const handleSelect = (event) => {
    setSelectedEvent(event);
    setLgShow(false);
  };

  return (
    <>
      <div
        className="form-control fs-4"
        onClick={() => setLgShow(true)}
        style={{ cursor: "pointer" }}
      >
        {selectedEvent
          ? selectedEvent.eventName + " - " + selectedEvent.eventPrice
          : "Choose Event"}
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={handleClose}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Choose Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row lg={2} sm={2} className="d-flex align-items-center">
              <Col className="p-2">
                <div className="input-group input-group-sm">
                  <input
                    className="fs-4 form-control"
                    placeholder="Tìm kiếm sự kiện"
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
                  Sort
                </button>
              </Col>
            </Row>

            <Row lg={4} sm={2} xs={1}>
              {events.map((event, index) => (
                <Col key={index} className="p-2">
                  <Card className="h-100" style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src={event.eventImage}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fs-2">
                        {event.eventName}
                      </Card.Title>
                      <Card.Text className="flex-grow-1">
                        <h3 className="text-success fw-bold">
                          {event.eventPrice}
                        </h3>
                        {event.eventDescription}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleSelect(event)}
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
