import axiosClient from "../config/axiosClient";

const roleApi = {
    create(data) {
        const url = "/roles";
        return axiosClient.post(url, data);
    },
    delete(role) {
        const url = `/roles/${role}`; // Đảm bảo đường dẫn khớp với backend
        return axiosClient.delete(url);
    }
};

export default roleApi;
