import axiosClient from "../config/axiosClient";

const eventserviceApi = {
    getAll(params) {
        const url = "/eventservice";
        return axiosClient.get(url, {params});
    },

    get(id) {
        const url = `/eventservice/${id}`;
        return axiosClient.get(url);
    },

    add(data) {
        const url = `/eventservice`;
        return axiosClient.post(url, data);
    },

    updateEventService(id, data) {
        const url = `/eventservice/${id}`;
        return axiosClient.put(url, data);
    },

    delete(id) {
        const url = `/eventservice/${id}`;
        return axiosClient.delete(url);
    },

    getPaginate(page, size) {
        const url = `/eventservice?page=${page}&size=${size}`;
        return axiosClient.get(url);
    },

    getEventServiceByService(page, size, dishId) {
        const url = `/eventservice/byService?dishId=${dishId}&page=${page}&size=${size}`;
        return axiosClient.get(url);
    },

    getServicesByEvent(page, size, menuId) {
        const url = `/eventservice/byEvent?menuId=${menuId}&page=${page}&size=${size}`;
        return axiosClient.get(url);
    },
    
    saveAllMenuDish(data) {
        const url = `/eventservice/saveAllMenuDish`;
        return axiosClient.post(url, data);
    },

};

export default eventserviceApi;