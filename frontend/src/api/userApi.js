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
  createPassword(password) {
    const url = `/users/create-password`;
    return axiosClient.post(url, password);
  }
};

export default userApi;