import api from '../authApi';

export const productServiceApi = {
    getAll: (params = {}) => api.get("/product-service", { params }),
    
    getById: (id) => api.get(`/product-service/${id}`),
    
    create: (productData) => api.post("/product-service", productData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    
    update: (id, productData) => api.put(`/product-service/${id}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    
    delete: (id, userId) => api.delete(`/product-service/${id}`, { 
        data: { user_id: userId } 
    }),
};

export default productServiceApi;