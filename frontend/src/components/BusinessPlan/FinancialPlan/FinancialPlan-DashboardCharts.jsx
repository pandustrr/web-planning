import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinancialPlanDashboardCharts = ({ plans }) => {
  const [dashboardData, setDashboardData] = useState(null);

  // Chart options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('Rp') || label.includes('Pendapatan') || label.includes('Laba')) {
                label += new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(context.parsed.y);
              } else if (label.includes('%') || label.includes('ROI')) {
                label += context.parsed.y + '%';
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.3)'
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            if (value >= 1000000) {
              return 'Rp' + (value / 1000000).toFixed(1) + 'Jt';
            } else if (value >= 1000) {
              return 'Rp' + (value / 1000).toFixed(0) + 'Rb';
            }
            return 'Rp' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.3)'
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    const safePlans = Array.isArray(plans) ? plans : [];
    
    if (safePlans.length > 0) {
      generateDashboardData(safePlans);
    } else {
      setDashboardData(null);
    }
  }, [plans]);

  const generateDashboardData = (safePlans) => {
    // Data untuk profit trend
    const profitTrendData = safePlans.map(plan => ({
      name: plan.plan_name && plan.plan_name.length > 10 ? plan.plan_name.substring(0, 10) + '...' : plan.plan_name || 'Unnamed',
      pendapatan: plan.total_monthly_income || 0,
      laba: plan.net_profit || 0,
      fullName: plan.plan_name || 'Unnamed Plan'
    }));

    // Data untuk feasibility distribution
    const feasibilityData = safePlans.reduce((acc, plan) => {
      const status = plan.feasibility_status || 'Tidak Diketahui';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const feasibilityChartData = Object.entries(feasibilityData).map(([name, value]) => ({
      name,
      value
    }));

    // Data untuk ROI comparison
    const roiData = safePlans.map(plan => ({
      name: plan.plan_name && plan.plan_name.length > 8 ? plan.plan_name.substring(0, 8) + '...' : plan.plan_name || 'Unnamed',
      roi: plan.roi_percentage || 0,
      fullName: plan.plan_name || 'Unnamed Plan'
    })).sort((a, b) => b.roi - a.roi);

    setDashboardData({
      profitTrend: profitTrendData,
      feasibility: feasibilityChartData,
      roiComparison: roiData
    });
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Ensure plans is an array before using
  const safePlans = Array.isArray(plans) ? plans : [];

  if (!dashboardData || safePlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  // Profit Trend Chart Data
  const profitTrendChartData = {
    labels: dashboardData.profitTrend.map(item => item.name),
    datasets: [
      {
        label: 'Pendapatan/Bulan',
        data: dashboardData.profitTrend.map(item => item.pendapatan),
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Laba Bersih/Bulan',
        data: dashboardData.profitTrend.map(item => item.laba),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // ROI Comparison Chart Data
  const roiComparisonChartData = {
    labels: dashboardData.roiComparison.map(item => item.name),
    datasets: [
      {
        label: 'ROI (%)',
        data: dashboardData.roiComparison.map(item => item.roi),
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // Feasibility Distribution Chart Data
  const feasibilityChartData = {
    labels: dashboardData.feasibility.map(item => item.name),
    datasets: [
      {
        data: dashboardData.feasibility.map(item => item.value),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Dashboard Analisis Rencana Keuangan
      </h3>

      {/* Profit Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Trend Pendapatan & Laba</h4>
        <div className="h-80">
          <Bar 
            data={profitTrendChartData} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                tooltip: {
                  ...chartOptions.plugins.tooltip,
                  callbacks: {
                    ...chartOptions.plugins.tooltip.callbacks,
                    title: function(tooltipItems) {
                      const fullNames = dashboardData.profitTrend.map(item => item.fullName);
                      return fullNames[tooltipItems[0].dataIndex] || tooltipItems[0].label;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Perbandingan ROI</h4>
          <div className="h-64">
            <Bar 
              data={roiComparisonChartData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    ...chartOptions.plugins.tooltip,
                    callbacks: {
                      title: function(tooltipItems) {
                        const fullNames = dashboardData.roiComparison.map(item => item.fullName);
                        return fullNames[tooltipItems[0].dataIndex] || tooltipItems[0].label;
                      }
                    }
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales.x,
                    ticks: {
                      ...chartOptions.scales.x.ticks,
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Feasibility Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Distribusi Kelayakan</h4>
          <div className="h-64">
            <Doughnut 
              data={feasibilityChartData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  tooltip: {
                    ...chartOptions.plugins.tooltip,
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} rencana (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{safePlans.length}</p>
          <p className="text-sm text-blue-600/80">Total Rencana</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {safePlans.length > 0 ? Math.round(safePlans.reduce((acc, plan) => acc + (plan.roi_percentage || 0), 0) / safePlans.length) : 0}%
          </p>
          <p className="text-sm text-green-600/80">ROI Rata-rata</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {safePlans.filter(p => p.feasibility_status === 'Layak').length}
          </p>
          <p className="text-sm text-purple-600/80">Rencana Layak</p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(safePlans.reduce((acc, plan) => acc + (plan.total_monthly_income || 0), 0))}
          </p>
          <p className="text-sm text-orange-600/80">Total Pendapatan/Bln</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanDashboardCharts;