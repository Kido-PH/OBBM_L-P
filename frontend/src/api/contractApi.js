import axiosClient from "../config/axiosClient";

const contractApi = {

    getAll(params) {
        const url = `/contract`;
        return axiosClient.get(url, {params});
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
        return axiosClient.post(url, data);
    },

    update(data) {
        const url = `/contract/${data.id}`;
        return axiosClient.put(url, data);
    },

    delete(id) {
        const url = `/contract/${id}`;
        return axiosClient.delete(url);
    },

};

export default contractApi;