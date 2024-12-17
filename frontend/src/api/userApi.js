import axios from "axios";
import axiosClient from "../config/axiosClient";

const userApi = {
  getAll(params) {
    const url = "/users";
    return axiosClient.get(url, { params });
  },
  getById(userId) {
    const url = `/users/${userId}`;
    return axiosClient.get(url);
  },
  getAllUser() {
    const url = `/users`;
    return axiosClient.get(url);
  },

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(
        `http://localhost:8080/obbm/auth/refresh`,
        { refreshToken: refreshToken }, // Sửa lại tên trường cho đúng với tên ở backend
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dạng JSON
          },
        }
      );

      // In ra dữ liệu khi response đã nhận
      console.log("Response data: ", response.data);

      if (response.data.code === 1000) {
        const { accessToken } = response.data.result;
        localStorage.setItem("accessToken", accessToken);
        return true; // Đã làm mới token thành công
      } else {
        console.error("Failed to refresh token:", response.data);
        return false; // Làm mới token thất bại
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false; // Nếu có lỗi khi gọi API
    }
  },

  createPassword(password) {
    const url = `/users/create-password`;
    return axiosClient.post(url, password);
  },

  // Đăng ký người dùng
  register(data) {
    const url = "/users/user"; // Endpoint cho đăng ký
    return axiosClient.post(url, data);
  },

  
  
};
export default userApi;
