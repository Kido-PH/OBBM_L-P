import axiosClient from "../config/axiosClient";

const assestApi = {
  // API lấy tất cả người dùng
  getAllUsers() {
    const url = `/users`;
    return axiosClient.get(url);
  },

  // API lấy tất cả vai trò
  getAllRoles() {
    const url = "/roles";
    return axiosClient.get(url); // Gọi API với axiosClient
  },

  // API lấy tất cả nhóm quyền
  getAllPerGroup() {
    const url = `/perGroup`;
    return axiosClient.get(url);
  },

  // API lưu quyền người dùng (UserRolePermissions)
  saveUserRolePermissions(data) {
    const url = `/user-role-permission`;
    return axiosClient.post(url, data);
  },
};

export default assestApi;
