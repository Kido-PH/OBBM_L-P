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
};

export default userApi;