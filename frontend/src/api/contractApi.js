import axiosClient from "../config/axiosClient";

const contractApi = {
  getAll(params) {
    const url = `/contract`;
    return axiosClient.get(url, { params });
  },

  getPaginate(page, size) {
    const url = `/contract?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  get(id) {
    const url = `/contract/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = `/contract`;
    console.log("Gọi API URL:", url);
    console.log("Dữ liệu gửi lên:", data);
    return axiosClient.post(url, data);
  },

  update(id, data) {
    const url = `/contract/${id}`;
    return axiosClient.put(url, data);
  },

  delete(id) {
    const url = `/contract/${id}`;
    return axiosClient.delete(url);
  },

  getAllContractsByStatusAndDateRange(status, startDate, endDate, page, size) {
    const url = `/contract/byStatusAndDateRange`;
    const params = {
      status,
      startDate,
      endDate,
      page,
      size,
    };
    return axiosClient.get(url, { params });
  },

  getRevenueStatistics(startDate, endDate) {
    const url = `/contract/statistics`;
    const params = {
      startDate,
      endDate,
    };
    return axiosClient.get(url, { params });
  },
};

export default contractApi;
