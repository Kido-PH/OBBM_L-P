import React, { useState } from "react";
import GuestContract from "./views/Guest-Contract";
import guestContractApi from "./api/guestContractApi";
import axiosClient from "config/axiosClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const multiStepContext = React.createContext();
const StepContext = () => {
  const [currentStep, setStep] = useState(1);
  var [contractData, setContractData] = useState([]);
  const [tempData, setTempData] = useState("");

  var [userData, setUserData] = useState({});
  var [menuData, setMenuData] = useState({});
  var [menuDishesData, setMenuDishesData] = useState([]);

  const [contractInfoUrl, setContractInfoUrl] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (contractInfoUrl) {
      navigate(contractInfoUrl);
    }
  }, [contractInfoUrl, navigate]);

  const currentUserId = JSON.parse(sessionStorage.getItem("currentUserId")); // Parse chuỗi JSON thành đối tượng

  const submitData = async () => {
    try {
      // Bước 1: Thêm menu
      const menuResponse = await guestContractApi.addMenu(menuData);
      console.log("Menu đã tạo thành công:", menuResponse.data);
      setMenuData(null);
    } catch (error) {
      console.error("Lỗi khi tạo Menu:", error);
      return; // Ngừng nếu có lỗi
    }

    let menuId;
    try {
      // Bước 2: Lấy menuId mới tạo
      const latestMenuResponse = await axiosClient.get(
        `http://localhost:8080/obbm/menu/latestMenu/${currentUserId}`
      );
      menuId = latestMenuResponse?.result?.menuId;
      console.log("Menu Id lấy được: ", menuId);

      // Thêm độ trễ 1 giây
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Lỗi khi lấy Menu Id:", error);
      return; // Ngừng nếu có lỗi
    }
    const contractDataWithMenuId = { ...contractData, menuId };

    try {
      // Bước 3: Tạo một biến mới contractDataWithMenuId để chứa contractData đã cập nhật với menuId
      const contractResponse = await guestContractApi.add(
        contractDataWithMenuId
      );
      console.log("Hợp đồng đã tạo thành công:", contractResponse.data);

      // Thêm độ trễ 2 giây
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
      console.log("Hợp đồng gửi đi:", contractDataWithMenuId);
      return; // Ngừng nếu có lỗi
    }

    let contractId;
    try {
      // Bước 4: Lấy contractId
      const latestContractResponse = await axiosClient.get(
        `http://localhost:8080/obbm/contract/latestContract/${currentUserId}`
      );
      contractId = latestContractResponse?.result?.contractId;

      if (!contractId) {
        console.error("Contract ID không tồn tại trong response.");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tạo hợp đồng thành công!",
        timer: 2000, // Tự động đóng sau 2 giây
        showConfirmButton: false,
      });

      console.log("Contract ID lấy được: ", contractId);
      setInfoUrl(contractId); // Chuyển hướng URL với contractId
    } catch (error) {
      console.error("Lỗi khi lấy Contract ID:", error);
    }
  };

  const setInfoUrl = (contractId) => {
    setContractInfoUrl(`info/${contractId}`);
  };

  return (
    <div>
      <multiStepContext.Provider
        value={{
          currentStep,
          setStep,
          contractData,
          setContractData,
          tempData,
          setTempData,
          userData,
          setUserData,
          menuData,
          setMenuData,
          menuDishesData,
          setMenuDishesData,
          submitData,
        }}
      >
        <GuestContract />
      </multiStepContext.Provider>
    </div>
  );
};

export default StepContext;
