import axiosClient from "../config/axiosClient";

const paymentApi = {
  createUrl(data) {
    const url = "/payment/create";
    return axiosClient.post(url, data);
  },
};

export default paymentApi;