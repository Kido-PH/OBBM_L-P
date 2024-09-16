import * as React from "react";

import { multiStepContext } from "../StepContext";
import { Form, Card} from "react-bootstrap";


const ContractCreateStep2 = () => {
  const { setStep, userData, setUserData } = React.useContext(multiStepContext);
  return (
    <div>
      <Card className="card p-5 w-100 mt-5">
      <div className="text-center mb-5">
          <h1>Step 2: Fill Your Information</h1>
        </div>

        <Form name="contractForm" className="contractForm">
          <div className="row row-cols-sm-1 row-cols-md-2">
            <div className="col">
              <div className="mb-3">
                <label className="form-label fw-bold">Step 2</label>{" "}
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
                  <button
                    type="button"
                    className="btn btn-sm px-3"
                    style={{ height: "32px" }}
                    data-bs-toggle="modal"
                    data-bs-target="#eventModal"
                  >
                    +
                  </button>
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
                <label className="form-label fw-bold">Description</label>
                <textarea className="form-control" id="a" rows="6"></textarea>
              </div>
            </div>
            
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-save-form mx-3"
              onClick={()=>setStep(1)}
              style={{ marginTop:"1rem" }}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-save-form mx-3"
              onClick={()=>setStep(3)}
              style={{ marginTop:"1rem"}}
            >
              Next
            </button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ContractCreateStep2;
