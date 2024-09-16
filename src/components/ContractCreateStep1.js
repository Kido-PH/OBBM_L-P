import * as React from "react";
import { Form, Card } from "react-bootstrap";

import { multiStepContext } from "../StepContext";
import EventModalBtn from "../components/EventsModal";

const ContractCreateStep1 = () => {
  const { setStep, userData, setUserData } = React.useContext(multiStepContext);
  return (
    <div>
      <Card className="card p-5 w-100 mt-5">
        <div className="text-center mb-5">
          <h1>Step 1: Choose Additional Content</h1>
        </div>

        <Form name="contractForm" className="contractForm">
          <div className="row row-cols-sm-1 row-cols-md-2">
            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Menu</label>
                <input
                  type="text"
                  id="menuId"
                  name="menuId"
                  placeholder="Detail Menu"
                  aria-label="Menu:"
                  className="form-control fs-4"
                  readOnly
                />
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
                  <EventModalBtn />
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
                  <button
                    type="button"
                    className="btn btn-sm px-3"
                    style={{ height: "32px" }}
                    data-bs-toggle="modal"
                    data-bs-target="#locationModal"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Celebration Date</label>{" "}
                <input
                  type="date"
                  name="date"
                  id="date"
                  placeholder="Detail Menu"
                  aria-label="Full Name:"
                  className="form-control fs-4"
                  required
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
                  <button
                    type="button"
                    className="btn btn-sm px-3 fs-4 me-2"
                    style={{ height: "32px" }}
                    data-bs-toggle="modal"
                    data-bs-target="#locationModal"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Description</label>
                <input className="form-control fs-4 me-2"></input>
              </div>
            </div>
          </div>

          <div className="container px-2 w-100">
            <div className="row row-cols-sm-1 row-cols-lg-4">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Before Tax</label>{" "}
                  <input
                    type="text"
                    name="beTax"
                    id="beTax"
                    placeholder="1.000.000"
                    aria-label="Full Name:"
                    className="form-control fs-4"
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
                  />
                </div>
              </div>

              <div className="col">
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
          </div>

          <div style={{ textAlign: "center" }}>
          <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={() => setStep(2)}
              style={{ margin: "10px auto" }}
            >
              Back to Menu
            </button>

            <button
              type="button"
              className="btn btn-save-form mx-2"
              onClick={() => setStep(2)}
              style={{ margin: "10px auto" }}
            >
              Next
            </button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ContractCreateStep1;
