import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Download, Calendar } from 'lucide-react';
import { financialPlanApi } from '../../../services/businessPlan';
import { toast } from 'react-toastify';

// Chart.js imports
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
    Filler,
    RadialLinearScale
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';

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
    Filler,
    RadialLinearScale
);

const FinancialPlanCharts = ({ plan, onBack }) => {
    const [activeChart, setActiveChart] = useState('profit_loss');
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('monthly');
    const [forecastData, setForecastData] = useState(null);

    const chartTypes = [
        { id: 'profit_loss', name: 'Laba Rugi', icon: '📊', color: '#4f46e5' },
        { id: 'capital_structure', name: 'Struktur Modal', icon: '💰', color: '#10b981' },
        { id: 'revenue_streams', name: 'Sumber Pendapatan', icon: '📈', color: '#ef4444' },
        { id: 'expense_breakdown', name: 'Breakdown Biaya', icon: '📉', color: '#8b5cf6' },
        { id: 'feasibility', name: 'Analisis Kelayakan', icon: '🔍', color: '#06b6d4' },
        { id: 'forecast', name: 'Proyeksi Masa Depan', icon: '🔮', color: '#8b5cf6' }
    ];

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
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (label.includes('Rp') || label.includes('Pendapatan') || label.includes('Biaya') || label.includes('Laba')) {
                                label += new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                }).format(context.parsed.y);
                            } else if (label.includes('%') || label.includes('ROI') || label.includes('Margin')) {
                                label += context.parsed.y + '%';
                            } else if (label.includes('Bulan')) {
                                label += context.parsed.y + ' bulan';
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
                    callback: function (value) {
                        if (activeChart === 'profit_loss' || activeChart === 'cash_flow' || activeChart === 'revenue_streams' || activeChart === 'expense_breakdown' || activeChart === 'forecast') {
                            if (value >= 1000000) {
                                return 'Rp' + (value / 1000000).toFixed(1) + 'Jt';
                            } else if (value >= 1000) {
                                return 'Rp' + (value / 1000).toFixed(0) + 'Rb';
                            }
                            return 'Rp' + value;
                        }
                        return value;
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

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899'];

    useEffect(() => {
        if (plan) {
            fetchChartData();
            fetchForecastData();
        }
    }, [plan, activeChart, timeRange]);

    const fetchChartData = async () => {
        try {
            setIsLoading(true);
            const response = await financialPlanApi.getChartData(plan.id, {
                chart_type: activeChart,
                time_range: timeRange
            });

            if (response.data.status === 'success') {
                setChartData(response.data.data);
            } else {
                throw new Error('Failed to fetch chart data');
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
            toast.error('Gagal memuat data chart');
            setChartData(generateFallbackData());
        } finally {
            setIsLoading(false);
        }
    };

    const fetchForecastData = async () => {
        try {
            const response = await financialPlanApi.getFinancialForecast(plan.id, {
                period: 12
            });
            if (response.data.status === 'success') {
                setForecastData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }
    };

    const generateFallbackData = () => {
        switch (activeChart) {
            case 'profit_loss':
                return {
                    labels: ['Pendapatan', 'Biaya Operasional', 'Laba Kotor', 'Laba Bersih'],
                    values: [
                        plan.total_monthly_income || 0,
                        plan.total_monthly_opex || 0,
                        plan.gross_profit || 0,
                        plan.net_profit || 0
                    ]
                };

            case 'capital_structure':
                const capitalSources = plan.capital_sources || [];
                return {
                    labels: capitalSources.map(source => source.source),
                    values: capitalSources.map(source => source.amount),
                    percentages: capitalSources.map(source => source.percentage)
                };

            case 'revenue_streams':
                const salesData = plan.sales_projections || [];
                return {
                    labels: salesData.map(item => item.product),
                    values: salesData.map(item => item.monthly_income)
                };

            case 'expense_breakdown':
                const opexData = plan.monthly_opex || [];
                return {
                    labels: opexData.map(item => item.category),
                    values: opexData.map(item => item.amount)
                };

            case 'feasibility':
                return {
                    labels: ['ROI', 'Payback Period', 'Profit Margin'],
                    values: [plan.roi_percentage || 0, plan.payback_period || 0, plan.profit_margin || 0],
                    targets: [25, 24, 20]
                };

            case 'forecast':
                return generateForecastData();

            default:
                return null;
        }
    };

    const generateForecastData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return months.map((month, index) => {
            const baseIncome = plan.total_monthly_income || 10000000;
            const baseOpex = plan.total_monthly_opex || 5000000;
            const growth = 1 + (index * 0.05);

            return {
                month,
                projected_income: baseIncome * growth,
                projected_opex: baseOpex * (1 + (index * 0.02)),
                projected_profit: (baseIncome * growth) - (baseOpex * (1 + (index * 0.02)))
            };
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Render chart berdasarkan type dengan Chart.js
    const renderChart = () => {
        if (!chartData) return null;

        switch (activeChart) {
            case 'profit_loss':
                const profitLossData = {
                    labels: chartData.labels || ['Pendapatan', 'Biaya Operasional', 'Laba Kotor', 'Laba Bersih'],
                    datasets: [
                        {
                            label: 'Nilai (Rp)',
                            data: chartData.values || [0, 0, 0, 0],
                            backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#4f46e5'],
                            borderColor: ['#10b981', '#ef4444', '#f59e0b', '#4f46e5'],
                            borderWidth: 1,
                            borderRadius: 4,
                        }
                    ]
                };

                return (
                    <div className="h-96">
                        <Bar
                            data={profitLossData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Analisis Laba Rugi Bulanan',
                                        color: '#1f2937',
                                        font: {
                                            size: 16
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                );

            case 'capital_structure':
                const capitalData = {
                    labels: chartData.labels || [],
                    datasets: [
                        {
                            data: chartData.values || [],
                            backgroundColor: COLORS,
                            borderColor: COLORS.map(color => color),
                            borderWidth: 1,
                        }
                    ]
                };

                return (
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="h-80 lg:h-96 lg:flex-1">
                            <Doughnut
                                data={capitalData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: {
                                            display: true,
                                            text: 'Struktur Modal',
                                            color: '#1f2937',
                                            font: {
                                                size: 16
                                            }
                                        },
                                        tooltip: {
                                            ...chartOptions.plugins.tooltip,
                                            callbacks: {
                                                label: function (context) {
                                                    const label = context.label || '';
                                                    const value = context.parsed;
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = Math.round((value / total) * 100);
                                                    return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2 min-w-[200px]">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Detail Modal</h4>
                            {chartData.labels?.map((label, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(chartData.values?.[index] || 0)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {chartData.percentages?.[index] || 0}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'revenue_streams':
                const revenueData = {
                    labels: chartData.labels?.map(label =>
                        label.length > 15 ? label.substring(0, 15) + '...' : label
                    ) || [],
                    datasets: [
                        {
                            label: 'Pendapatan/Bulan',
                            data: chartData.values || [],
                            backgroundColor: '#4f46e5',
                            borderColor: '#4f46e5',
                            borderWidth: 1,
                            borderRadius: 4,
                        }
                    ]
                };

                return (
                    <div className="h-96">
                        <Bar
                            data={revenueData}
                            options={{
                                ...chartOptions,
                                indexAxis: 'y',
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Sumber Pendapatan',
                                        color: '#1f2937',
                                        font: {
                                            size: 16
                                        }
                                    },
                                    tooltip: {
                                        ...chartOptions.plugins.tooltip,
                                        callbacks: {
                                            title: function (tooltipItems) {
                                                const fullLabels = chartData.labels || [];
                                                return fullLabels[tooltipItems[0].dataIndex] || tooltipItems[0].label;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                );

            case 'expense_breakdown':
                const expenseData = {
                    labels: chartData.labels?.map(label =>
                        label.length > 15 ? label.substring(0, 15) + '...' : label
                    ) || [],
                    datasets: [
                        {
                            data: chartData.values || [],
                            backgroundColor: COLORS,
                            borderColor: COLORS.map(color => color),
                            borderWidth: 1,
                        }
                    ]
                };

                return (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="h-80 lg:h-96 lg:flex-1">
                            <Pie
                                data={expenseData}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: {
                                            display: true,
                                            text: 'Breakdown Biaya Operasional',
                                            color: '#1f2937',
                                            font: {
                                                size: 16
                                            }
                                        },
                                        tooltip: {
                                            ...chartOptions.plugins.tooltip,
                                            callbacks: {
                                                title: function (tooltipItems) {
                                                    const fullLabels = chartData.labels || [];
                                                    return fullLabels[tooltipItems[0].dataIndex] || tooltipItems[0].label;
                                                },
                                                label: function (context) {
                                                    const label = context.label || '';
                                                    const value = context.parsed;
                                                    return `${label}: ${formatCurrency(value)}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="space-y-2 min-w-[200px]">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Detail Biaya</h4>
                            {chartData.labels?.map((label, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300" title={label}>
                                            {label.length > 20 ? label.substring(0, 20) + '...' : label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-red-600 dark:text-red-400">
                                            {formatCurrency(chartData.values?.[index] || 0)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'feasibility':
                const feasibilityData = {
                    labels: chartData.labels || ['ROI', 'Payback Period', 'Profit Margin'],
                    datasets: [
                        {
                            label: 'Nilai Aktual',
                            data: chartData.values || [0, 0, 0],
                            backgroundColor: '#4f46e5',
                            borderColor: '#4f46e5',
                            borderWidth: 1,
                            borderRadius: 4,
                        },
                        {
                            label: 'Target Ideal',
                            data: chartData.targets || [25, 24, 20],
                            backgroundColor: '#94a3b8',
                            borderColor: '#94a3b8',
                            borderWidth: 1,
                            borderRadius: 4,
                            opacity: 0.7,
                        }
                    ]
                };

                return (
                    <div className="h-96">
                        <Bar
                            data={feasibilityData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Analisis Kelayakan vs Target',
                                        color: '#1f2937',
                                        font: {
                                            size: 16
                                        }
                                    },
                                    tooltip: {
                                        ...chartOptions.plugins.tooltip,
                                        callbacks: {
                                            label: function (context) {
                                                let label = context.dataset.label || '';
                                                const value = context.parsed.y;
                                                if (context.datasetIndex === 0) {
                                                    // Actual values
                                                    if (context.dataIndex === 0) return `${label}: ${value}%`; // ROI
                                                    if (context.dataIndex === 1) return `${label}: ${value} bulan`; // Payback
                                                    if (context.dataIndex === 2) return `${label}: ${value}%`; // Margin
                                                } else {
                                                    // Target values
                                                    if (context.dataIndex === 0) return `${label}: ${value}%`; // ROI Target
                                                    if (context.dataIndex === 1) return `${label}: ${value} bulan`; // Payback Target
                                                    if (context.dataIndex === 2) return `${label}: ${value}%`; // Margin Target
                                                }
                                                return `${label}: ${value}`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                );

            case 'forecast':
                if (!forecastData) return null;

                const forecastChartData = {
                    labels: forecastData.map(item => item.month),
                    datasets: [
                        {
                            label: 'Proyeksi Pendapatan',
                            data: forecastData.map(item => item.projected_income),
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Proyeksi Biaya',
                            data: forecastData.map(item => item.projected_opex),
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Proyeksi Laba',
                            data: forecastData.map(item => item.projected_profit),
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            fill: true,
                            tension: 0.4,
                        }
                    ]
                };

                return (
                    <div className="h-96">
                        <Line
                            data={forecastChartData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Proyeksi Keuangan 12 Bulan',
                                        color: '#1f2937',
                                        font: {
                                            size: 16
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500 dark:text-gray-400">Chart tidak tersedia</p>
                    </div>
                );
        }
    };

    const downloadChart = () => {
        toast.info('Fitur download chart akan segera tersedia');
    };

    if (!plan) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Detail
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analisis Grafik Keuangan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Visualisasi data rencana keuangan "{plan.plan_name}"</p>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                        >
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Chart Type Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex overflow-x-auto gap-1">
                    {chartTypes.map((chart) => (
                        <button
                            key={chart.id}
                            onClick={() => setActiveChart(chart.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeChart === chart.id
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span className="text-lg">{chart.icon}</span>
                            {chart.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <p className="text-gray-500 dark:text-gray-400">Memuat data chart...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chart Title */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                {chartTypes.find(chart => chart.id === activeChart)?.icon}
                                {chartTypes.find(chart => chart.id === activeChart)?.name}
                            </h3>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Periode: {timeRange === 'monthly' ? 'Bulanan' : 'Tahunan'}
                            </div>
                        </div>

                        {/* Chart Content */}
                        <div className="min-h-[400px]">
                            {renderChart()}
                        </div>

                        {/* Chart Insights */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Insights:</h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {generateChartInsights()}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(plan.total_monthly_income || 0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pendapatan/Bln</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {plan.roi_percentage || 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {plan.profit_margin || 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Profit Margin</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {plan.payback_period || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bulan Balik Modal</p>
                </div>
            </div>
        </div>
    );

    function generateChartInsights() {
        switch (activeChart) {
            case 'profit_loss':
                return [
                    `Laba bersih bulanan: ${formatCurrency(plan.net_profit || 0)}`,
                    `Margin profit: ${plan.profit_margin || 0}%`,
                    (plan.net_profit || 0) > 0
                        ? 'Usaha menunjukkan profitabilitas yang positif'
                        : 'Perlu evaluasi biaya operasional dan strategi pendapatan'
                ];

            case 'capital_structure':
                const mainSource = plan.capital_sources?.[0];
                return [
                    mainSource ? `Sumber modal utama: ${mainSource.source} (${mainSource.percentage}%)` : 'Belum ada data modal',
                    `Total modal awal: ${formatCurrency(plan.total_initial_capital || 0)}`,
                    'Diversifikasi sumber modal dapat mengurangi risiko'
                ];

            case 'revenue_streams':
                const topProduct = plan.sales_projections?.[0];
                return [
                    topProduct ? `Produk andalan: ${topProduct.product}` : 'Belum ada data penjualan',
                    `Total pendapatan bulanan: ${formatCurrency(plan.total_monthly_income || 0)}`,
                    'Diversifikasi produk dapat meningkatkan stabilitas pendapatan'
                ];

            case 'expense_breakdown':
                const largestExpense = plan.monthly_opex?.[0];
                return [
                    largestExpense ? `Biaya terbesar: ${largestExpense.category}` : 'Belum ada data biaya',
                    `Total biaya operasional: ${formatCurrency(plan.total_monthly_opex || 0)}`,
                    'Evaluasi efisiensi pada biaya terbesar untuk optimasi'
                ];

            case 'feasibility':
                return [
                    `Status kelayakan: ${plan.feasibility_status || 'Belum dianalisis'}`,
                    (plan.roi_percentage || 0) >= 20 ? 'ROI menunjukkan performa yang baik' : 'Perlu peningkatan ROI',
                    (plan.payback_period || 0) <= 24 ? 'Periode balik modal wajar' : 'Periode balik modal perlu dipercepat'
                ];

            case 'forecast':
                return [
                    'Proyeksi membantu perencanaan jangka panjang',
                    'Siapkan skenario untuk berbagai kondisi pasar',
                    'Update proyeksi secara berkala berdasarkan performa aktual'
                ];

            default:
                return ['Analisis data untuk insights lebih lanjut...'];
        }
    }
};

export default FinancialPlanCharts;