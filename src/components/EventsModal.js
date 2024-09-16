import * as React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Example() {
  const [lgShow, setLgShow] = React.useState(false);
  const handleClose = () => setLgShow(false);

  return (
    <>
      <Button
        type="button"
        className="btn btn-sm px-3"
        style={{ height: "32px" }}
        onClick={() => setLgShow(true)}
      >
        +
      </Button>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        className=""
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-1">Choose Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <div ></div>
            <Container>
              <Row lg={4} sm={2} xs={1}>
                <Col className="p-2">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                    />
                    <Card.Body>
                      <Card.Title className="fs-2">J97 Karaoke</Card.Title>
                      <Card.Text>
                        <h3 className="text-success fw-bold">10.000.000 VND</h3>
                        Talented singer to entertain at your wedding
                      </Card.Text>
                      <Button variant="primary">Select</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col className="p-2">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                    />
                    <Card.Body>
                      <Card.Title className="fs-2">J97 Karaoke</Card.Title>
                      <Card.Text>
                        <h3 className="text-success fw-bold">10.000.000 VND</h3>
                        Talented singer to entertain at your wedding
                      </Card.Text>
                      <Button variant="primary">Select</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col className="p-2">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                    />
                    <Card.Body>
                      <Card.Title className="fs-2">J97 Karaoke</Card.Title>
                      <Card.Text>
                        <h3 className="text-success fw-bold">10.000.000 VND</h3>
                        Talented singer to entertain at your wedding
                      </Card.Text>
                      <Button variant="primary">Select</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col className="p-2">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                    />
                    <Card.Body>
                      <Card.Title className="fs-2">J97 Karaoke</Card.Title>
                      <Card.Text>
                        <h3 className="text-success fw-bold">10.000.000 VND</h3>
                        Talented singer to entertain at your wedding
                      </Card.Text>
                      <Button variant="primary">Select</Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col className="p-2">
                  <Card style={{ width: "100%" }}>
                    <Card.Img
                      variant="top"
                      style={{ maxWidth: "200px" }}
                      src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/haoph/2021_10_21/jack-va-thien-an-5805.jpeg"
                    />
                    <Card.Body>
                      <Card.Title className="fs-2">J97 Karaoke</Card.Title>
                      <Card.Text>
                        <h3 className="text-success fw-bold">10.000.000 VND</h3>
                        Talented singer to entertain at your wedding
                      </Card.Text>
                      <Button variant="primary">Select</Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
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
