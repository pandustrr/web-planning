import api from '../authApi';

export const marketAnalysisApi = {
    getAll: (params = {}) => {
        return api.get("/market-analysis", { params })
            .then(response => {
                console.log('✅ Market analyses API response:', response.data);
                return response;
            })
            .catch(error => {
                console.error('❌ Market analyses API error:', error);
                throw error;
            });
    },
    
    getById: (id) => {
        return api.get(`/market-analysis/${id}`);
    },
    
    create: (analysisData) => {
        return api.post("/market-analysis", analysisData);
    },
    
    update: (id, analysisData) => {
        return api.put(`/market-analysis/${id}`, analysisData);
    },
    
    delete: (id, userId) => {
        return api.delete(`/market-analysis/${id}`, { 
            data: { user_id: userId } 
        });
    },
};

export default marketAnalysisApi;