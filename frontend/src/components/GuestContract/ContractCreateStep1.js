import * as React from "react";
import { Form, Card } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";

import { multiStepContext } from "../../StepContext";
import ModalEvents from "./ModalEvents";
import ModalLocations  from "./ModalLocations";

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
                  <ModalEvents/>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Location</label>
                <div className="d-flex align-items-center">
                  <ModalLocations/>
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
            <div className="row row-cols-sm-1 row-cols-lg-3">
              <div className="col">
                <div className="mb-3">
                  <label className="form-label fw-bold">Additional service cost</label>{" "}
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
              
            </div>
          </div>

          <div style={{ textAlign: "center" }}>          
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
