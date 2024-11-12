import axiosClient from "../config/axiosClient";

const menuApi = {
    getAll(params) {
        const url = "/menu?page=1&size=7";
        return axiosClient.get(url, {params});
    },

    get(id) {
        const url = `/menu/${id}`;
        return axiosClient.get(url);
    },

    add(data) {
        const url = `/menu`;
        return axiosClient.post(url, data);
    },

    update(data) {
        const url = `/menu/${data.id}`;
        return axiosClient.put(url, data);
    },

    delete(id) {
        const url = `/menu/${id}`;
        return axiosClient.delete(url);
    },
    getPaginate(page, size) {
        const url = `/menu?page=${page}&size=${size}`;
        return axiosClient.get(url);
    },
};

export default menuApi;