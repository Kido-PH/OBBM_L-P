import axiosClient from "../config/axiosClient";

const guestContractApi = {
  getAll(page, size) {
    const url = `/contract?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  get(id) {
    const url = `/contract/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = `/contract`;
    return axiosClient.post(url, data);
  },

  addMenuAsUser(data) {
    const url = "/menu/user";
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/contract/${data.id}`;
    return axiosClient.patch(url, data);
  },

  delete(id) {
    const url = `/contract/${id}`;
    return axiosClient.delete(url);
  },

  deleteMenu(id) {
    const url = `/menu/${id}`;
    return axiosClient.delete(url);
  },

  getInfoContract(id) {
    const url = `/contract/${id}`;
    return axiosClient.get(url);
  },

  getLastestMenuId(id) {
    const url = `/menu/lastestMenu/${id}`;
    return axiosClient.get(url);
  },

  getLastestContractId(id) {
    const url = `/contract/lastestContract/${id}`;
    return axiosClient.get(url);
  },

  getContractList(userId, page, size) {
    const url = `/contract/user/${userId}?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
};

export default guestContractApi;
