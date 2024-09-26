import * as React from "react";
import { Form, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";

import { multiStepContext } from "../../StepContext";

const ContractCreateStep1 = () => {
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
        <Card className="card p-5 w-100 mt-5 paymentCard">
          <div className="text-center mb-5 fw-bold">
            <h1>Contract Infomation</h1>
          </div>
          <Card name="contractInfo" className="p-5" style={{ opacity: 0.9 }}>
            <h2 style={{ color: "hsl(28, 100%, 58%)" }}>
              Contract Information
            </h2>
            <Form name="contractForm" className="contractForm">
              <div className="row row-cols-sm-1 row-cols-md-2">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Menu</label>
                    <a
                      href="/menu"
                      id="menuId"
                      name="menuId"
                      aria-label="Menu:"
                      className="form-control fs-4 d-flex justify-content-between align-middle"
                    >
                      Menu Id
                      <FaEye />
                    </a>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Event</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value=""
                        name="event"
                        required
                        placeholder="Choose Event"
                        aria-label="Event"
                        className="form-control fs-4 me-2"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Location</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value=""
                        name="location"
                        required
                        placeholder="Choose Location"
                        aria-label="UserName"
                        className="form-control fs-4 me-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Celebration Date
                    </label>{" "}
                    <input
                      type="date"
                      name="date"
                      id="date"
                      placeholder="Detail Menu"
                      aria-label="Full Name:"
                      className="form-control fs-4"
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Service</label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value=""
                        name="location"
                        required
                        placeholder="Choose Additional Service"
                        aria-label="Service"
                        className="form-control fs-4 me-2"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <input className="form-control fs-4 me-2" readOnly></input>
                  </div>
                </div>
              </div>
              <h2 style={{ color: "hsl(28, 100%, 58%)" }}>
                Customer Information
              </h2>
              <div className="row row-cols-sm-1 row-cols-md-2">
                <div className="col">
                  <div className="mb-3">
                    <label className="form-label fw-bold ">
                      Customer Name
                      <span className="text-danger d-inline-block">*</span>
                    </label>{" "}
                    <input
                      type="text"
                      id="menuId"
                      name="menuId"
                      placeholder="Customer Name"
                      className="form-control fs-4"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Customer Phone
                      <span className="text-danger d-inline-block">*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        value=""
                        name="event"
                        required
                        placeholder="Customer Phone"
                        aria-label="Event"
                        className="form-control fs-4 me-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="col">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Customer Email
                      <span className="text-danger d-inline-block">*</span>
                    </label>{" "}
                    <input
                      type="email"
                      name="email"
                      id="date"
                      placeholder="Youremail@gmail.com"
                      className="form-control fs-4"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Created Date</label>{" "}
                    <input
                      type="date"
                      name="createdDate"
                      id="createdDate"
                      className="form-control fs-4"
                    />
                  </div>
                </div>
              </div>

              <h2 style={{ color: "hsl(28, 100%, 58%)" }}>Costs</h2>

              <div className=" px-2 w-100">
                <div className="row row-cols-sm-1  row-cols-md-3 row-cols-lg-5">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Menu cost</label>{" "}
                      <input
                        type="text"
                        placeholder="1.000.000"
                        aria-label="Full Name:"
                        className="form-control fs-4"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Additional service cost
                      </label>{" "}
                      <input
                        type="text"
                        placeholder="1.000.000"
                        aria-label="Full Name:"
                        className="form-control fs-4"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Customer location costs
                      </label>{" "}
                      <input
                        type="text"
                        placeholder="1.000.000"
                        aria-label="Full Name:"
                        className="form-control fs-4"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Tax</label>{" "}
                      <input
                        type="text"
                        name="tax"
                        id="tax"
                        placeholder="10%"
                        className="form-control fs-4"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Total</label>{" "}
                      <input
                        type="text"
                        name="total"
                        id="total"
                        placeholder="0"
                        className="form-control text-success fw-bold fs-4"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <h2 style={{ color: "hsl(28, 100%, 58%)" }}>
                Contract Status:{" "}
                <span className="text-warning d-inline-block">Pending</span>
              </h2>
            </Form>
          </Card>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-save-form mx-3"
              style={{ marginTop: "1rem" }}
            >
              Pay
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContractCreateStep1;
