import axios from "axios";
import Cookies from "js-cookie";
import { getToken, setToken } from "../services/localStorageService";

const apiClient = axios.create({
  baseURL: "http://59.153.218.244:8080/obbm", // Base URL của API
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Làm mới accessToken bằng refreshToken
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const { data } = await axios.post(
          "http://59.153.218.244:8080/obbm/auth/refresh",
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.code !== 1000) {
          throw new Error(data.message || "Không thể làm mới accessToken.");
        }

        const newAccessToken = data.result.accessToken;
        setToken(newAccessToken); // Lưu accessToken mới vào localStorage

        // Thay thế accessToken cũ trong request gốc
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(error.config); // Gửi lại request gốc với accessToken mới
      } catch (refreshError) {
        console.error("Làm mới accessToken thất bại:", refreshError.message);
        return Promise.reject(refreshError); // Nếu làm mới thất bại, trả lỗi
      }
    }

    return Promise.reject(error); // Nếu không phải lỗi 401, trả lỗi
  }
);

export default apiClient;
