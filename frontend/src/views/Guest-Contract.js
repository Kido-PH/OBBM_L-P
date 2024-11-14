import React, { useContext } from "react";
import { Stepper, StepLabel, Step, Box } from "@mui/material";
import { multiStepContext } from "../StepContext";

import FirstStep from "../components/GuestContract/ContractCreateStep1";
import SecondStep from "../components/GuestContract/ContractCreateStep2";
import ThirdStep from "../components/GuestContract/ContractCreateStep3";
import danhMucApi from "../api/danhMucApi";

const Contract = () => {
  const [categories, setCategories] = React.useState([]); //demo

  React.useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
    import("../assets/css/mainStyle.css");
    import("../assets/css/contractGuestStyle.css");

    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6InRpbnRyYW5seDE1OSIsImV4cCI6MTc0OTQxNDk5MCwiaWF0IjoxNzMxNDE0OTkwLCJqdGkiOiI1NDk1NmMxMy1iYWE5LTQ1ZTAtOTY4NC04NjU3YzZiNmEzYzIiLCJzY29wZSI6IlJPTEVfVVNFUiJ9.d6U8CuWiQ4C-LF6Rt5AdvBl08c4zu9qe3ifYZ6Zm81JvQ9f6przUNmHpLCGgwsV2MQGggkL2IsT5Oo4hxomZTQ";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
    const currentUserID = "d1fffd0c-ae87-4d19-aaf6-e554fba1d930";
    const currentEvent = {
      eventId: 1,
      event_name: "Tiệc đầy tháng",
      event_totalcost: 1000000,
    };

    const currentMenu = {
      name: "Menu VVVIP",
      totalcost: 432000,
      description: "Thực đơn của Tín",
      userId: currentUserID,
      eventId: currentEvent.eventId,
    };

    const currentMenuDishes = [
      { menudish_id: 1, menudish_price: 150000, menu_id: 1, dish_id: 1 },
      { menudish_id: 3, menudish_price: 250000, menu_id: 1, dish_id: 1 },
      { menudish_id: 4, menudish_price: 100000, menu_id: 1, dish_id: 1 },
    ];

    localStorage.setItem(
      "currentMenuDishes",
      JSON.stringify(currentMenuDishes)
    );
    localStorage.setItem("createdMenu", JSON.stringify(currentMenu));
    localStorage.setItem("currentEvent", JSON.stringify(currentEvent));
    sessionStorage.setItem("currentUserId", JSON.stringify(currentUserID));

    const fetchDanhMuc = async () => {
      const danhMucList = await danhMucApi.getPage(1, 100);

      setCategories(danhMucList.result.content); //set state
      console.log(danhMucList);
    };
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
