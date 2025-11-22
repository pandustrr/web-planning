import api from '../authApi';

export const pdfBusinessPlanApi = {
    /**
     * Generate and download PDF
     * @param {number} userId - User ID
     * @param {boolean} isPro - Whether to generate pro version (without watermark)
     * @returns {Promise<Blob>} PDF blob
     */
    generatePdf: async (userId, isPro = false) => {
        try {
            const response = await api.get('/business-plan/generate-pdf', {
                params: {
                    user_id: userId,
                    is_pro: isPro
                },
                responseType: 'blob', // Important for binary data
            });
            
            return response.data;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    },

    /**
     * Preview PDF in browser
     * @param {number} userId - User ID
     * @param {boolean} isPro - Whether to preview pro version
     * @returns {Promise<Blob>} PDF blob
     */
    previewPdf: async (userId, isPro = false) => {
        try {
            const response = await api.get('/business-plan/preview-pdf', {
                params: {
                    user_id: userId,
                    is_pro: isPro
                },
                responseType: 'blob',
            });
            
            return response.data;
        } catch (error) {
            console.error('Error previewing PDF:', error);
            throw error;
        }
    },

    /**
     * Download PDF with automatic filename
     * @param {number} userId - User ID
     * @param {boolean} isPro - Whether to download pro version
     * @param {string} businessName - Business name for filename
     * @returns {Promise<void>}
     */
    downloadPdf: async (userId, isPro = false, businessName = 'Business-Plan') => {
        try {
            const response = await api.get('/business-plan/generate-pdf', {
                params: {
                    user_id: userId,
                    is_pro: isPro
                },
                responseType: 'blob',
            });

            // Create blob from response
            const blob = new Blob([response.data], { type: 'application/pdf' });
            
            // Get filename from Content-Disposition header or create default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `${businessName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            return { success: true, filename };
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw error;
        }
    },

    /**
     * Open PDF in new tab
     * @param {number} userId - User ID
     * @param {boolean} isPro - Whether to open pro version
     * @returns {Promise<void>}
     */
    openPdfInNewTab: async (userId, isPro = false) => {
        try {
            const response = await api.get('/business-plan/preview-pdf', {
                params: {
                    user_id: userId,
                    is_pro: isPro
                },
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Open in new tab
            window.open(url, '_blank');
            
            // Note: URL will be automatically revoked when the tab is closed
            // or we can revoke it after a delay
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
            
            return { success: true };
        } catch (error) {
            console.error('Error opening PDF:', error);
            throw error;
        }
    }
};

export default pdfBusinessPlanApi;