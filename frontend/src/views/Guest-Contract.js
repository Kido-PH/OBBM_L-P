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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJraWRvLmNvbSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNzI5MzQ5MzgwLCJpYXQiOjE3MjkzNDc1ODAsImp0aSI6ImY4YTdlYzY3LTZkMTctNDQxMC1hYWUzLTNhYWM0MTAxYTQ3NSIsInNjb3BlIjoiUk9MRV9BRE1JTiJ9.D6gFn9YB5-Uhjn-mq9c3O_l3IOqm-sztDAGttJkizcGo09Vkt6DviDh97vEpbYS-ZRHaIdfOkr5AOtjuZ_WDxw";
    sessionStorage.setItem("token", token); // Lưu token vào sessionStorage

    const fetchDanhMuc = async () => {
      const danhMucList = await danhMucApi.getAll();

      setCategories(danhMucList.result.content); //set state
      console.log(danhMucList);
    };

    fetchDanhMuc();
  }, []);

  const steps = [
    "Step 1: Choose Additional Content",
    "Step 2: Fill Your Information",
    "Step 3: Payment",
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
            Contract Registration
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

        <div className="categories">
          <h2 className="my-4">Danh Mục</h2>
          {categories.map((category) => (
            <div key={category.categoryId} className="category mb-4">
              <h3>{category.name} - {category.description}</h3>
              <div className="dishes">
                {category.listDish.length > 0 ? (
                  category.listDish.map((dish) => (
                    <div key={dish.dishId} className="dish">
                      <h4>{dish.name}</h4>
                      <p>{dish.description}</p>
                      <p>Giá: {dish.price.toLocaleString()} VND</p>
                      <img src={dish.image} alt={dish.name} style={{ maxWidth: "200px" }} />
                      <p>Tình trạng: {dish.existing}</p>
                    </div>
                  ))
                ) : (
                  <p>Không có món ăn trong danh mục này.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Contract;
