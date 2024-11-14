import React, { useContext } from "react";
import { Stepper, StepLabel, Step, Box } from "@mui/material";
import { multiStepContext } from "../StepContext";

import FirstStep from "../components/GuestContract/ContractCreateStep1";
import SecondStep from "../components/GuestContract/ContractCreateStep2";
import ThirdStep from "../components/GuestContract/ContractCreateStep3";
import danhMucApi from "../api/danhMucApi";

const Contract = () => {
  React.useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
    import("../assets/css/mainStyle.css");
    import("../assets/css/contractGuestStyle.css");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6InRpbnRyYW4iLCJleHAiOjE3MzMzODYxMDcsImlhdCI6MTczMTU4NjEwNywianRpIjoiOGI4YTI1OGEtOGRmNy00MTI2LWI2ZTItY2EyZWM2M2NhZjY0Iiwic2NvcGUiOiJST0xFX1VTRVIifQ.09BbIjB_kS2u-HJ3CWRYfYuJAM5H5YO-n7nb5EoY2FLrWDQgpB7OgYNKnssI3hzUS9XU6JruFI9bPAbTmBpQIg";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    const currentUserID = "98fc9a36-5a51-4c7f-b308-fc6f8f408b5d";
    const currentEvent = {
      eventId: 1,
      event_name: "Tiệc đầy tháng",
      event_totalcost: 1000000,
    };

    localStorage.setItem("currentEvent", JSON.stringify(currentEvent));
    sessionStorage.setItem("currentUserId", JSON.stringify(currentUserID));
  }, []);

  const steps = [
    "Step 1: Cung cấp thông tin khách hàng",
    "Step 2: Chọn nội dung hợp đồng",
    "Step 3: Xác nhận hợp đồng",
  ];

  const { currentStep, finalData } = useContext(multiStepContext);

  function showStep(step) {
    console.log(step);
    switch (step) {
      case 1:
        return <FirstStep />;
      case 2:
        return <SecondStep />;
      case 3:
        return <ThirdStep />;
      default:
    }
  }

  return (
    <section
      className="section section-divider white account-section pt-5"
      id="blog"
    >
      <div className="container" style={{ marginTop: "120px" }}>
        <div className="fs-4">
          <p className="section-subtitle fs-1 pt-2 pb-4 mb-0 text-center fw-bold">
            Tạo hợp đồng
          </p>
          <div className="center-stepper">
            <Box sx={{ width: "100%" }}>
              <Stepper
                activeStep={currentStep - 1}
                alternativeLabel
                sx={{
                  // Thay đổi kích thước của các phần tử trong Stepper
                  "& .MuiStepLabel-label": {
                    fontSize: "1.6rem", // Kích thước font chữ của label
                    fontWeight: "bold",
                  },
                  "& .MuiStepConnector-line": {
                    height: "5px", // Độ dày của đường nối
                  },
                  "& .MuiStepIcon-root": {
                    fontSize: "4rem", // Kích thước của biểu tượng bước
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </div>
        </div>

        {showStep(currentStep)}
      </div>
    </section>
  );
};

export default Contract;
