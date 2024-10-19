import * as React from "react";

import { multiStepContext } from "../../StepContext";
import { Form, Card } from "react-bootstrap";

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
                <label className="form-label fw-bold ">
                  Tên Khách Hàng
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
                  Số Điện Thoại Khách Hàng
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
                  Email Khách Hàng
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
             
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-secondary btn-save-form mx-3"
              onClick={() => setStep(1)}
              style={{ marginTop: "1rem" }}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-save-form mx-3"
              onClick={() => setStep(3)}
              style={{ marginTop: "1rem" }}
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
