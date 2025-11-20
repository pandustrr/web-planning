import React, { useState, useEffect, useRef } from 'react';
import { backgroundApi } from '../../../services/businessPlan/backgroundApi';
import pdfBusinessPlanApi from '../../../services/businessPlan/pdfBusinessPlanApi';
import { financialPlanApi } from '../../../services/businessPlan/financialPlanApi';
import html2canvas from 'html2canvas';

const PdfBusinessPlan = ({ onBack }) => {
  const [businessBackgrounds, setBusinessBackgrounds] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedBusinessData, setSelectedBusinessData] = useState(null);
  const [financialPlans, setFinancialPlans] = useState([]);
  const [mode, setMode] = useState('free');
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Refs untuk chart
  const chartRefs = useRef({});

  useEffect(() => {
    loadBusinessBackgrounds();
    loadStatistics();
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      loadSelectedBusinessData();
      loadFinancialPlans();
    } else {
      setSelectedBusinessData(null);
      setFinancialPlans([]);
      setValidationErrors([]);
    }
  }, [selectedBusiness]);

  const loadBusinessBackgrounds = async () => {
    try {
      const response = await backgroundApi.getAll();
      if (response.data.status === 'success') {
        setBusinessBackgrounds(response.data.data);
      }
    } catch (error) {
      console.error('Error loading business backgrounds:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data bisnis' });
    }
  };

  const loadSelectedBusinessData = async () => {
    try {
      const response = await backgroundApi.getById(selectedBusiness);
      if (response.data.status === 'success') {
        setSelectedBusinessData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading selected business data:', error);
    }
  };

  const loadFinancialPlans = async () => {
    try {
      const response = await financialPlanApi.getAll({
        business_background_id: selectedBusiness
      });
      console.log('📊 Financial plans API response:', response.data);
      
      if (response.data.status === 'success') {
        const plans = Array.isArray(response.data.data) ? response.data.data : [];
        console.log('✅ Financial plans loaded:', plans.length, 'plans');
        setFinancialPlans(plans);
      } else {
        console.log('❌ No financial plans data');
        setFinancialPlans([]);
      }
    } catch (error) {
      console.error('❌ Error loading financial plans:', error);
      setFinancialPlans([]);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await pdfBusinessPlanApi.getStatistics();
      if (response.data.status === 'success') {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Function untuk capture chart sebagai gambar
  const captureChartAsImage = async (chartElement, chartName) => {
    if (!chartElement) {
      console.log(`❌ Chart element not found: ${chartName}`);
      return null;
    }

    try {
      console.log(`🖼️ Capturing chart: ${chartName}`);
      
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: false,
        logging: true,
        width: chartElement.scrollWidth,
        height: chartElement.scrollHeight
      });

      const imageData = canvas.toDataURL('image/png');
      console.log(`✅ Chart captured successfully: ${chartName}`, imageData.substring(0, 100) + '...');
      
      return imageData;
    } catch (error) {
      console.error(`❌ Error capturing chart ${chartName}:`, error);
      return null;
    }
  };

  // Function untuk generate semua chart images
  const generateAllChartImages = async () => {
    console.log('🚀 Starting chart image generation...');
    
    // Pastikan financialPlans adalah array
    const safeFinancialPlans = Array.isArray(financialPlans) ? financialPlans : [];
    
    if (safeFinancialPlans.length === 0) {
      console.log('ℹ️ No financial plans available for chart generation');
      return {};
    }

    console.log(`📈 Generating charts for ${safeFinancialPlans.length} financial plans`);

    const allChartImages = {};

    // Tunggu sebentar untuk memastikan DOM sudah dirender sepenuhnya
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (const plan of safeFinancialPlans) {
      try {
        console.log(`\n🎯 Processing financial plan: ${plan.id} - ${plan.plan_name}`);
        
        const planChartImages = {};

        // Capture Profit & Loss Chart
        const profitLossRef = chartRefs.current[`profit-loss-${plan.id}`];
        if (profitLossRef) {
          const profitLossImage = await captureChartAsImage(profitLossRef, `profit-loss-${plan.id}`);
          if (profitLossImage) {
            planChartImages.profit_loss = profitLossImage;
          }
        } else {
          console.log(`⚠️ Profit-loss chart ref not found for plan ${plan.id}`);
        }

        // Capture Revenue Streams Chart
        const revenueRef = chartRefs.current[`revenue-${plan.id}`];
        if (revenueRef) {
          const revenueImage = await captureChartAsImage(revenueRef, `revenue-${plan.id}`);
          if (revenueImage) {
            planChartImages.revenue_streams = revenueImage;
          }
        } else {
          console.log(`⚠️ Revenue chart ref not found for plan ${plan.id}`);
        }

        // Capture Capital Structure Chart
        const capitalRef = chartRefs.current[`capital-${plan.id}`];
        if (capitalRef) {
          const capitalImage = await captureChartAsImage(capitalRef, `capital-${plan.id}`);
          if (capitalImage) {
            planChartImages.capital_structure = capitalImage;
          }
        } else {
          console.log(`⚠️ Capital structure chart ref not found for plan ${plan.id}`);
        }

        allChartImages[plan.id] = planChartImages;
        console.log(`✅ Completed charts for plan ${plan.id}:`, Object.keys(planChartImages));

      } catch (error) {
        console.error(`❌ Error processing charts for plan ${plan.id}:`, error);
        allChartImages[plan.id] = {};
      }
    }

    console.log('🎉 All chart images generated:', allChartImages);
    return allChartImages;
  };

  const validateBusinessData = () => {
    const errors = [];

    if (!selectedBusinessData) {
      errors.push('Data bisnis tidak ditemukan');
      return errors;
    }

    if (!selectedBusinessData.name) {
      errors.push('Nama bisnis harus diisi');
    }

    if (!selectedBusinessData.description) {
      errors.push('Deskripsi bisnis harus diisi');
    }

    if (!selectedBusinessData.category) {
      errors.push('Kategori bisnis harus diisi');
    }

    return errors;
  };

  const handleGeneratePdf = async (preview = false) => {
    if (!selectedBusiness) {
      setMessage({ type: 'error', text: 'Pilih bisnis terlebih dahulu' });
      return;
    }

    // Validasi data sebelum generate PDF
    const errors = validateBusinessData();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage({ 
        type: 'error', 
        text: 'Data bisnis belum lengkap. Silakan lengkapi data terlebih dahulu.' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setValidationErrors([]);

    try {
      console.log('🚀 Starting PDF generation process...');
      
      // Step 1: Generate chart images dari React components
      console.log('📸 Step 1: Generating chart images from React components...');
      const chartImages = await generateAllChartImages();
      
      console.log('✅ Chart images generated:', Object.keys(chartImages).length, 'plans with charts');

      // Step 2: Kirim ke backend Laravel
      console.log('📤 Step 2: Sending data to Laravel backend...');
      
      if (preview) {
        console.log('👁️ Generating preview...');
        const response = await pdfBusinessPlanApi.previewPdf(
          selectedBusiness, 
          mode, 
          chartImages
        );
        
        if (response.data.status === 'success') {
          setPreviewData(response.data.data);
          setPreviewOpen(true);
          setMessage({ type: 'success', text: 'Preview berhasil dibuat' });
        } else {
          throw new Error(response.data.message || 'Failed to generate preview');
        }
      } else {
        console.log('📥 Generating PDF download...');
        const response = await pdfBusinessPlanApi.generatePdf(
          selectedBusiness, 
          mode, 
          chartImages
        );
        
        console.log('✅ PDF generated by backend, downloading...');
        
        // Create blob and download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from response headers or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'business-plan.pdf';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setMessage({ type: 'success', text: 'PDF berhasil diunduh' });
        console.log('🎉 PDF download completed');
      }
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      
      let errorMessage = 'Gagal menghasilkan PDF. ';
      
      if (error.response?.status === 500) {
        errorMessage += 'Server error. Pastikan semua data bisnis sudah lengkap dan valid.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Silakan coba lagi atau hubungi administrator.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExecutiveSummary = async () => {
    if (!selectedBusiness) {
      setMessage({ type: 'error', text: 'Pilih bisnis terlebih dahulu' });
      return;
    }

    const errors = validateBusinessData();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage({ 
        type: 'error', 
        text: 'Data bisnis belum lengkap. Silakan lengkapi data terlebih dahulu.' 
      });
      return;
    }

    setLoading(true);
    try {
      const response = await pdfBusinessPlanApi.generateExecutiveSummary(selectedBusiness);
      if (response.data.status === 'success') {
        setPreviewData({
          executive_summary: response.data.data.executive_summary,
          business_name: response.data.data.business_name,
          type: 'executive_summary'
        });
        setPreviewOpen(true);
      }
    } catch (error) {
      console.error('Error generating executive summary:', error);
      setMessage({ type: 'error', text: 'Gagal menghasilkan ringkasan eksekutif' });
    } finally {
      setLoading(false);
    }
  };

  const getBusinessCompletionStatus = () => {
    if (!selectedBusinessData) return 0;

    let completedFields = 0;
    const requiredFields = [
      'name',
      'description', 
      'category',
      'location',
      'business_type'
    ];

    requiredFields.forEach(field => {
      if (selectedBusinessData[field]) completedFields++;
    });

    return Math.round((completedFields / requiredFields.length) * 100);
  };

  // Function untuk render chart preview yang akan di-capture
  const renderChartPreviews = () => {
    const safeFinancialPlans = Array.isArray(financialPlans) ? financialPlans : [];
    
    if (safeFinancialPlans.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Tidak ada data rencana keuangan untuk ditampilkan
        </div>
      );
    }

    return safeFinancialPlans.map(plan => (
      <div key={plan.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          📊 Chart Preview - {plan.plan_name}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profit Loss Chart Preview */}
          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <h5 className="text-sm font-medium mb-2 text-center">💰 Profit & Loss</h5>
            <div 
              ref={el => {
                if (el) {
                  chartRefs.current[`profit-loss-${plan.id}`] = el;
                  console.log(`✅ Profit-loss chart ref set for plan ${plan.id}`);
                }
              }}
              className="chart-container"
              style={{ 
                height: '200px', 
                background: 'white',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            >
              <div style={{ 
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <h6 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Profit & Loss Analysis
                </h6>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'flex-end', 
                  height: '120px', 
                  gap: '15px',
                  flex: 1
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      height: `${Math.min(100, ((plan.total_monthly_income || 0) / ((plan.total_monthly_income || 0) + 1)) * 80)}px`, 
                      width: '35px', 
                      background: '#10b981',
                      margin: '0 auto',
                      borderRadius: '4px 4px 0 0'
                    }}></div>
                    <div style={{ fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>Income</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>
                      Rp {new Intl.NumberFormat('id-ID').format(plan.total_monthly_income || 0)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      height: `${Math.min(100, ((plan.total_monthly_opex || 0) / ((plan.total_monthly_income || 1)) * 80))}px`, 
                      width: '35px', 
                      background: '#ef4444',
                      margin: '0 auto',
                      borderRadius: '4px 4px 0 0'
                    }}></div>
                    <div style={{ fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>Expense</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>
                      Rp {new Intl.NumberFormat('id-ID').format(plan.total_monthly_opex || 0)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      height: `${Math.min(100, ((plan.net_profit || 0) / ((plan.total_monthly_income || 1)) * 80))}px`, 
                      width: '35px', 
                      background: '#3b82f6',
                      margin: '0 auto',
                      borderRadius: '4px 4px 0 0'
                    }}></div>
                    <div style={{ fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>Net Profit</div>
                    <div style={{ fontSize: '9px', color: '#6b7280' }}>
                      Rp {new Intl.NumberFormat('id-ID').format(plan.net_profit || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Streams Chart Preview */}
          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <h5 className="text-sm font-medium mb-2 text-center">📈 Revenue Streams</h5>
            <div 
              ref={el => {
                if (el) {
                  chartRefs.current[`revenue-${plan.id}`] = el;
                  console.log(`✅ Revenue chart ref set for plan ${plan.id}`);
                }
              }}
              className="chart-container"
              style={{ 
                height: '200px', 
                background: 'white',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            >
              <div style={{ 
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                height: '100%'
              }}>
                <h6 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Revenue Sources
                </h6>
                <div style={{ 
                  fontSize: '11px', 
                  textAlign: 'left',
                  height: '140px',
                  overflowY: 'auto'
                }}>
                  {plan.sales_projections?.length > 0 ? (
                    plan.sales_projections.map((projection, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        padding: '4px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ fontWeight: '500' }}>{projection.product}</span>
                        <span style={{ fontWeight: 'bold', color: '#059669' }}>
                          Rp {new Intl.NumberFormat('id-ID').format(projection.monthly_income || 0)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#6b7280', 
                      fontStyle: 'italic',
                      marginTop: '50px'
                    }}>
                      No revenue data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capital Structure Chart Preview */}
          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
            <h5 className="text-sm font-medium mb-2 text-center">🏦 Capital Structure</h5>
            <div 
              ref={el => {
                if (el) {
                  chartRefs.current[`capital-${plan.id}`] = el;
                  console.log(`✅ Capital chart ref set for plan ${plan.id}`);
                }
              }}
              className="chart-container"
              style={{ 
                height: '200px', 
                background: 'white',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            >
              <div style={{ 
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                height: '100%'
              }}>
                <h6 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  Funding Sources
                </h6>
                <div style={{ 
                  fontSize: '11px', 
                  textAlign: 'left',
                  height: '140px',
                  overflowY: 'auto'
                }}>
                  {plan.capital_sources?.length > 0 ? (
                    plan.capital_sources.map((source, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        padding: '4px 0',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ fontWeight: '500' }}>{source.source}</span>
                        <span style={{ fontWeight: 'bold', color: '#7c3aed' }}>
                          {source.percentage}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#6b7280', 
                      fontStyle: 'italic',
                      marginTop: '50px'
                    }}>
                      No capital data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            ← Kembali ke Menu Utama
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 PDF Business Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate laporan business plan profesional dalam format PDF dengan grafik keuangan
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.total_business_plans}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Business Plans
              </div>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Business Completion Status */}
        {selectedBusinessData && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Status Kelengkapan Data
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {getBusinessCompletionStatus()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getBusinessCompletionStatus()}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Chart Previews Section */}
        {selectedBusiness && Array.isArray(financialPlans) && financialPlans.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📊 Preview Grafik Keuangan
              </h3>
              <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                {financialPlans.length} Rencana Keuangan
              </span>
            </div>
            {renderChartPreviews()}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Info:</strong> Grafik di atas akan dikonversi menjadi gambar berkualitas tinggi 
                dan dimasukkan ke dalam PDF. Pastikan data keuangan sudah lengkap sebelum generate PDF.
              </p>
            </div>
          </div>
        )}

        {/* Main Control Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Bisnis
              </label>
              <select
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih bisnis...</option>
                {businessBackgrounds.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name} - {business.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode PDF
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="free">🆓 Gratis - Dengan Watermark</option>
                <option value="pro">💎 Pro - Tanpa Watermark</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => handleGeneratePdf(true)}
              disabled={loading || !selectedBusiness || getBusinessCompletionStatus() < 50}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                '👁️ Preview PDF'
              )}
            </button>

            <button
              onClick={() => handleGeneratePdf(false)}
              disabled={loading || !selectedBusiness || getBusinessCompletionStatus() < 80}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                '📥 Download PDF'
              )}
            </button>
          </div>

          {/* Process Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔄 Alur Generate PDF:
            </h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
              <li>Render grafik di React menggunakan HTML/CSS</li>
              <li>Convert grafik menjadi gambar PNG berkualitas tinggi</li>
              <li>Kirim gambar ke backend Laravel</li>
              <li>Laravel generate PDF dengan menyisipkan gambar grafik</li>
              <li>Download PDF yang sudah include grafik keuangan</li>
            </ol>
          </div>
        </div>

        {/* Preview Modal */}
        {previewOpen && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Preview - {previewData.business_name || 'Business Plan'}
                  </h2>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {previewData.type === 'executive_summary' ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Ringkasan Eksekutif
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <pre className="whitespace-pre-line text-gray-700 dark:text-gray-300 font-sans">
                        {previewData.executive_summary}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Data Preview untuk PDF
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Filename:</strong> {previewData.filename}
                        </div>
                        <div>
                          <strong>Mode:</strong> {previewData.mode === 'free' ? '🆓 Gratis' : '💎 Pro'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                          📊 Data yang akan dimasukkan:
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>• Informasi Bisnis: ✅</div>
                          <div>• Analisis Pasar: {previewData.preview_data?.market_analysis ? '✅' : '❌'}</div>
                          <div>• Produk/Layanan: {previewData.preview_data?.products_services?.length || 0} item</div>
                          <div>• Strategi Pemasaran: {previewData.preview_data?.marketing_strategies?.length || 0} item</div>
                          <div>• Rencana Operasional: {previewData.preview_data?.operational_plans?.length || 0} item</div>
                          <div>• Struktur Tim: {previewData.preview_data?.team_structures?.length || 0} anggota</div>
                          <div>• Rencana Keuangan: {previewData.preview_data?.financial_plans?.length || 0} plan</div>
                          <div>• Grafik Keuangan: {previewData.chart_data ? '✅' : '❌'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Tutup
                </button>
                {previewData.type !== 'executive_summary' && (
                  <button
                    onClick={() => {
                      setPreviewOpen(false);
                      handleGeneratePdf(false);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfBusinessPlan;