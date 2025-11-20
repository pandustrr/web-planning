import api from '../authApi';

const pdfBusinessPlanApi = {
  // Generate PDF dengan chart images
  generatePdf: (businessBackgroundId, mode = 'free', chartImages = {}) => {
    console.log('📤 Sending PDF generation request to backend...');
    console.log('Business ID:', businessBackgroundId);
    console.log('Mode:', mode);
    console.log('Chart images count:', Object.keys(chartImages).length);
    
    return api.post('/pdf-business-plan/generate', {
      business_background_id: businessBackgroundId,
      mode: mode,
      chart_images: chartImages
    }, {
      responseType: 'blob', // Important for file download
      timeout: 60000, // 60 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  // Preview PDF data dengan chart images
  previewPdf: (businessBackgroundId, mode = 'free', chartImages = {}) => {
    console.log('📤 Sending PDF preview request to backend...');
    
    return api.post('/pdf-business-plan/generate', {
      business_background_id: businessBackgroundId,
      mode: mode,
      preview: true,
      chart_images: chartImages
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  // Generate executive summary
  generateExecutiveSummary: (businessBackgroundId) => {
    return api.post('/pdf-business-plan/executive-summary', {
      business_background_id: businessBackgroundId
    });
  },

  // Get PDF statistics
  getStatistics: () => {
    return api.get('/pdf-business-plan/statistics');
  }
};

export default pdfBusinessPlanApi;