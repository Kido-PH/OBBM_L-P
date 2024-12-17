import axiosClient from "../config/axiosClient";

const eventApi = {

  getAll() {
    const url = `/event?page=1&size=100`;
    return axiosClient.get(url);
  },

  get(id) {
    const url = `/event/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = `/event`;
    return axiosClient.post(url, data);
  },

  addAsUser(data) {
    const url = `/event/user`;
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/event/${data.id}`;
    return axiosClient.put(url, data);
  },

  delete(id) {
    const url = `/event/${id}`;
    return axiosClient.delete(url);
  },

  getPaginate(page, size) {
    const url = `/event?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  getLastestEventId(userId) {
    const url = `/event/lastestEvent/${userId}`;
    return axiosClient.get(url);
  },
};

export default eventApi;
