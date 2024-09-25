import React from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa"; // Icon tìm kiếm

const ContractList = () => {
  React.useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
    import("../../assets/css/mainStyle.css");
    import("../../assets/css/contractGuestStyle.css");
  }, []);

  return (
    <section
      className="section section-divider white account-section pt-5"
      id="blog"
    >
      <div className="container" style={{ marginTop: "120px" }}>
        <Card border="1" className="p-5">
          <div className="row row-cols-sm-1 row-cols-md-3">
            <div className="col mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  aria-label="Search"
                  className=" fs-4"
                />
                <InputGroup.Text>
                  <FaSearch size={16}/>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 mt-3">
            <div className="col mb-3">
              <Card className="p-3">
                <div className="card-title text-body-secondary fw-bold d-flex justify-content-center align-items-center">
                  HD001
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Phone: 0884852524
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Total:{" "}
                  <span className="text-success ps-1"> 1.100.000 VND</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Created Date: <span className="ps-1">01/08/2024</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Status: <span className="text-success ps-1"> Pending </span>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3">
                  <a
                    href="/contract-info/id"
                    className="btn btn-secondary btn-sm p-3 "
                  >
                    Detail
                  </a>
                  <button className="btn btn-secondary btn-sm p-3 mx-3">
                    Pay
                  </button>
                </div>
              </Card>
            </div>

            <div className="col mb-3">
              <Card className="p-3">
                <div className="card-title text-body-secondary fw-bold d-flex justify-content-center align-items-center">
                  HD001
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Phone: 0884852524
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Total:{" "}
                  <span className="text-success ps-1"> 1.100.000 VND</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Created Date: <span className="ps-1">01/08/2024</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Status: <span className="text-success ps-1"> Pending </span>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3">
                  <a
                    href="/contract-info/id"
                    className="btn btn-secondary btn-sm p-3 "
                  >
                    Detail
                  </a>
                  <button className="btn btn-secondary btn-sm p-3 mx-3">
                    Pay
                  </button>
                </div>
              </Card>
            </div>

            <div className="col mb-3">
              <Card className="p-3">
                <div className="card-title text-body-secondary fw-bold d-flex justify-content-center align-items-center">
                  HD001
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Phone: 0884852524
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Total:{" "}
                  <span className="text-success ps-1"> 1.100.000 VND</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Created Date: <span className="ps-1">01/08/2024</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Status: <span className="text-success ps-1"> Pending </span>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3">
                  <a
                    href="/contract-info/id"
                    className="btn btn-secondary btn-sm p-3 "
                  >
                    Detail
                  </a>
                  <button className="btn btn-secondary btn-sm p-3 mx-3">
                    Pay
                  </button>
                </div>
              </Card>
            </div>

            <div className="col mb-3">
              <Card className="p-3">
                <div className="card-title text-body-secondary fw-bold d-flex justify-content-center align-items-center">
                  HD001
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Phone: 0884852524
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Total:{" "}
                  <span className="text-success ps-1"> 1.100.000 VND</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Created Date: <span className="ps-1">01/08/2024</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  Status: <span className="text-success ps-1"> Pending </span>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-3">
                  <a
                    href="/contract-info/id"
                    className="btn btn-secondary btn-sm p-3 "
                  >
                    Detail
                  </a>
                  <button className="btn btn-secondary btn-sm p-3 mx-3">
                    Pay
                  </button>
                </div>
              </Card>
            </div>
          </div>

          <div className="row">
					<div className="col-12 d-flex justify-content-center mt-4">
						<div className="btn-group" role="group" aria-label="Pagination">
							<button type="button" className="btn " >Fisrt</button>
							<button type="button" className="btn "
								>Previous</button>
							<button type="button" className="btn "
								>Next</button>
							<button type="button" className="btn "
								>Last</button>
						</div>
					</div>
					<div className="row mt-2">
						<div className="col-12 text-center">1/1</div>
					</div>
				</div>

        </Card>
      </div>
    </section>
  );
};

export default ContractList;
