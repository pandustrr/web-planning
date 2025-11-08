import api from '../authApi'; //

export const backgroundApi = {

    getAll: () => api.get("/business-background"),

    getById: (id) => api.get(`/business-background/${id}`),

    create: (businessData) => {

        if (businessData.logo instanceof File) {
        const formData = new FormData();
        Object.keys(businessData).forEach((key) => {
            if (businessData[key] !== null && businessData[key] !== undefined) {
            formData.append(key, businessData[key]);
            }
        });
        return api.post("/business-background", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        }
        return api.post("/business-background", businessData);
    },


    update: (id, businessData) => {
        // If there's a file, use FormData with PUT method
        if (businessData.logo instanceof File) {
        const formData = new FormData();
        Object.keys(businessData).forEach((key) => {
            if (businessData[key] !== null && businessData[key] !== undefined) {
            formData.append(key, businessData[key]);
            }
        });
        formData.append("_method", "PUT"); // For Laravel to recognize as PUT
        return api.post(`/business-background/${id}`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        }
        return api.put(`/business-background/${id}`, businessData);
    },


    delete: (id) => api.delete(`/business-background/${id}`),

    /**
     * Get business backgrounds for dropdowns
     */
    getForDropdown: () => api.get("/business-backgrounds"),

};

export default backgroundApi;