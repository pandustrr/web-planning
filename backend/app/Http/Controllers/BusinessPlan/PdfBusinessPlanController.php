<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\BusinessBackground;
use App\Models\MarketAnalysis;
use App\Models\ProductService;
use App\Models\MarketingStrategy;
use App\Models\OperationalPlan;
use App\Models\TeamStructure;
use App\Models\FinancialPlan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PdfBusinessPlanController extends Controller
{
    /**
     * Generate PDF Business Plan
     */
    public function generatePdf(Request $request)
    {
        try {
            Log::info('🚀 PDF Generation Started', [
                'user_id' => Auth::id(),
                'business_background_id' => $request->business_background_id,
                'mode' => $request->mode,
                'has_chart_images' => !empty($request->chart_images),
                'chart_images_count' => $request->chart_images ? count($request->chart_images) : 0
            ]);

            $userId = Auth::id();
            $businessBackgroundId = $request->business_background_id;
            $mode = $request->mode ?? 'free';
            $chartImages = $request->chart_images ?? [];
            $isPreview = $request->preview ?? false;

            // Validasi input
            if (!$businessBackgroundId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background ID is required'
                ], 422);
            }

            // Ambil semua data business plan
            $businessData = $this->getBusinessPlanData($userId, $businessBackgroundId);

            $executiveSummary = $this->createExecutiveSummary($businessData);

            if (!$businessData['business_background']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background not found'
                ], 404);
            }

            // Process chart images - SIMPAN sebagai file sementara
            $processedChartImages = $this->processChartImages($chartImages);

            // Generate chart data untuk PDF
            $chartData = $this->generateChartDataForPdf($businessData);

            // Log data yang ditemukan
            Log::info('📊 Business Data Found', [
                'business_name' => $businessData['business_background']->name,
                'financial_plans_count' => count($businessData['financial_plans']),
                'processed_chart_images' => $processedChartImages
            ]);

            // Jika preview mode, return data saja
            if ($isPreview) {
                Log::info('👁️ Returning preview data');

                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'preview_data' => $businessData,
                        'chart_data' => $chartData,
                        'chart_images' => $processedChartImages,
                        'filename' => "business-plan-" . Str::slug($businessData['business_background']->name) . "-" . now()->format('Y-m-d') . ".pdf",
                        'mode' => $mode,
                        'business_name' => $businessData['business_background']->name
                    ],
                    'message' => 'Preview data generated successfully'
                ]);
            }

            // Generate PDF
            Log::info('📄 Generating PDF with chart images...');

            $pdf = PDF::loadView('pdf.business-plan', [
                'data' => $businessData,
                'mode' => $mode,
                'executiveSummary' => $executiveSummary,
                'chartData' => $chartData,
                'chartImages' => $processedChartImages,
                'generated_at' => now()->format('d F Y H:i:s')
            ]);

            // Konfigurasi PDF
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'Arial',
                'chroot' => [public_path(), storage_path()],
                'enable_php' => true,
            ]);

            $businessName = Str::slug($businessData['business_background']->name);
            $filename = "business-plan-{$businessName}-" . now()->format('Y-m-d') . ".pdf";

            Log::info('✅ PDF Generated Successfully', [
                'filename' => $filename,
                'chart_images_included' => count($processedChartImages)
            ]);

            // Clean up temporary chart images
            $this->cleanupChartImages($processedChartImages);

            return $pdf->download($filename);

        } catch (\Exception $e) {
            Log::error('❌ Error generating PDF: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'business_background_id' => $request->business_background_id ?? 'null'
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process chart images from base64 to file paths
     */
    private function processChartImages($chartImages)
    {
        $processedImages = [];

        try {
            Log::info('🖼️ Processing chart images...', [
                'total_plans' => count($chartImages)
            ]);

            foreach ($chartImages as $planId => $charts) {
                Log::info("Processing charts for plan {$planId}", [
                    'chart_types' => array_keys($charts)
                ]);

                foreach ($charts as $chartType => $base64Image) {
                    if ($base64Image && strpos($base64Image, 'data:image/png;base64,') === 0) {
                        try {
                            // Remove data URL prefix
                            $base64Data = substr($base64Image, strlen('data:image/png;base64,'));

                            // Decode base64
                            $imageData = base64_decode($base64Image);

                            if ($imageData === false) {
                                Log::error("Failed to decode base64 image for plan {$planId}, chart {$chartType}");
                                continue;
                            }

                            // Create unique filename
                            $filename = "chart_{$planId}_{$chartType}_" . time() . "_" . Str::random(8) . ".png";
                            $directory = storage_path('app/public/charts/');
                            $filePath = $directory . $filename;

                            // Ensure directory exists
                            if (!file_exists($directory)) {
                                mkdir($directory, 0755, true);
                            }

                            // Save image
                            $saveResult = file_put_contents($filePath, $imageData);

                            if ($saveResult === false) {
                                Log::error("Failed to save chart image to: {$filePath}");
                                continue;
                            }

                            // Verify the file was created
                            if (!file_exists($filePath)) {
                                Log::error("Chart image file not found after saving: {$filePath}");
                                continue;
                            }

                            $fileSize = filesize($filePath);
                            Log::info("✅ Chart image saved successfully", [
                                'plan_id' => $planId,
                                'chart_type' => $chartType,
                                'file_path' => $filePath,
                                'file_size' => $fileSize
                            ]);

                            $processedImages[$planId][$chartType] = $filePath;

                        } catch (\Exception $e) {
                            Log::error("Error processing chart image for plan {$planId}, chart {$chartType}: " . $e->getMessage());
                        }
                    } else {
                        Log::warning("Invalid base64 image for plan {$planId}, chart {$chartType}");
                    }
                }
            }

            Log::info('🎉 Chart images processing completed', [
                'processed_plans' => count($processedImages)
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error in processChartImages: ' . $e->getMessage());
        }

        return $processedImages;
    }

    /**
     * Clean up temporary chart images
     */
    private function cleanupChartImages($chartImages)
    {
        try {
            foreach ($chartImages as $planCharts) {
                foreach ($planCharts as $chartPath) {
                    if (file_exists($chartPath)) {
                        unlink($chartPath);
                    }
                }
            }
            Log::info('🧹 Temporary chart images cleaned up');
        } catch (\Exception $e) {
            Log::error('Error cleaning up chart images: ' . $e->getMessage());
        }
    }

    /**
     * Get all business plan data
     */
    private function getBusinessPlanData($userId, $businessBackgroundId)
    {
        try {
            $businessBackground = BusinessBackground::with('user')
                ->where('user_id', $userId)
                ->where('id', $businessBackgroundId)
                ->first();

            if (!$businessBackground) {
                return ['business_background' => null];
            }

            return [
                'business_background' => $businessBackground,
                'market_analysis' => MarketAnalysis::with(['businessBackground', 'competitors'])
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->first(),
                'products_services' => ProductService::with(['businessBackground', 'user'])
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->get(),
                'marketing_strategies' => MarketingStrategy::with('businessBackground')
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->get(),
                'operational_plans' => OperationalPlan::with(['businessBackground', 'user'])
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->get(),
                'team_structures' => TeamStructure::with(['businessBackground', 'user', 'operationalPlan'])
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->orderBy('sort_order')
                    ->get(),
                'financial_plans' => FinancialPlan::with(['businessBackground', 'user'])
                    ->where('user_id', $userId)
                    ->where('business_background_id', $businessBackgroundId)
                    ->get()
            ];
        } catch (\Exception $e) {
            Log::error('Error getting business plan data: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate Executive Summary
     */
    public function generateExecutiveSummary(Request $request)
    {
        try {
            $userId = Auth::id();
            $businessBackgroundId = $request->business_background_id;

            if (!$businessBackgroundId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background ID is required'
                ], 422);
            }

            $businessData = $this->getBusinessPlanData($userId, $businessBackgroundId);

            if (!$businessData['business_background']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background not found'
                ], 404);
            }

            $executiveSummary = $this->createExecutiveSummary($businessData);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'executive_summary' => $executiveSummary,
                    'business_name' => $businessData['business_background']->name
                ],
                'message' => 'Executive summary generated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating executive summary: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate executive summary'
            ], 500);
        }
    }

    /**
     * Create executive summary from business data
     */
    private function createExecutiveSummary($businessData)
    {
        $business = $businessData['business_background'];
        $marketAnalysis = $businessData['market_analysis'];
        $financialPlan = $businessData['financial_plans']->first();

        $summary = "RINGKASAN EKSEKUTIF\n\n";
        $summary .= "{$business->name} adalah bisnis dalam kategori {$business->category} ";
        $summary .= "yang berfokus pada {$business->description}.\n\n";

        if ($marketAnalysis) {
            $summary .= "Bisnis ini menargetkan pasar: " . ($marketAnalysis->target_market ?? 'Belum ditentukan') . ". ";

            if ($marketAnalysis->tam_total) {
                $summary .= "Dengan analisis pasar yang menunjukkan Total Addressable Market (TAM) sebesar Rp " . number_format($marketAnalysis->tam_total, 0, ',', '.');
            }

            if ($marketAnalysis->competitive_advantage) {
                $summary .= " Keunggulan kompetitif utama: {$marketAnalysis->competitive_advantage}.\n\n";
            }
        }

        if ($financialPlan) {
            $summary .= "Dari aspek keuangan, bisnis ini memproyeksikan pendapatan bulanan sebesar Rp " .
                number_format($financialPlan->total_monthly_income ?? 0, 0, ',', '.') .
                " dengan ROI " . ($financialPlan->roi_percentage ?? 0) . "%.\n\n";
        }

        if ($business->vision) {
            $summary .= "Visi: {$business->vision}\n\n";
        }

        if ($business->mission) {
            $summary .= "Misi: {$business->mission}\n\n";
        }

        $summary .= "Dokumen business plan ini menyajikan analisis komprehensif mengenai strategi, operasional, ";
        $summary .= "dan rencana keuangan untuk mewujudkan visi bisnis tersebut.";

        return $summary;
    }

    /**
     * Generate chart data untuk PDF (dalam bentuk array/tabel)
     */
    private function generateChartDataForPdf($businessData)
    {
        $chartData = [];

        if (isset($businessData['financial_plans']) && count($businessData['financial_plans']) > 0) {
            foreach ($businessData['financial_plans'] as $financialPlan) {
                $planData = [
                    'plan_name' => $financialPlan->plan_name,
                    'profit_loss' => $this->generateProfitLossData($financialPlan),
                    'revenue_streams' => $this->generateRevenueStreamsData($financialPlan),
                    'capital_structure' => $this->generateCapitalStructureData($financialPlan),
                    'expense_breakdown' => $this->generateExpenseBreakdownData($financialPlan),
                    'financial_metrics' => $this->generateFinancialMetricsData($financialPlan)
                ];
                $chartData[$financialPlan->id] = $planData;
            }
        }

        return $chartData;
    }

    /**
     * Generate profit loss data untuk PDF
     */
    private function generateProfitLossData($financialPlan)
    {
        return [
            ['Kategori', 'Jumlah (Rp)'],
            ['Pendapatan Bulanan', number_format($financialPlan->total_monthly_income ?? 0, 0, ',', '.')],
            ['Biaya Operasional', number_format($financialPlan->total_monthly_opex ?? 0, 0, ',', '.')],
            ['Laba Kotor', number_format($financialPlan->gross_profit ?? 0, 0, ',', '.')],
            ['Pajak', number_format($financialPlan->tax_amount ?? 0, 0, ',', '.')],
            ['Laba Bersih', number_format($financialPlan->net_profit ?? 0, 0, ',', '.')]
        ];
    }

    /**
     * Generate revenue streams data untuk PDF
     */
    private function generateRevenueStreamsData($financialPlan)
    {
        $revenueData = [['Produk/Layanan', 'Harga', 'Volume/Bulan', 'Pendapatan/Bulan']];

        if ($financialPlan->sales_projections) {
            foreach ($financialPlan->sales_projections as $projection) {
                $revenueData[] = [
                    $projection['product'] ?? 'Tidak ada nama',
                    'Rp ' . number_format($projection['price'] ?? 0, 0, ',', '.'),
                    number_format($projection['volume'] ?? 0, 0, ',', '.'),
                    'Rp ' . number_format($projection['monthly_income'] ?? 0, 0, ',', '.')
                ];
            }
        }

        return $revenueData;
    }

    /**
     * Generate capital structure data untuk PDF
     */
    private function generateCapitalStructureData($financialPlan)
    {
        $capitalData = [['Sumber Modal', 'Jumlah (Rp)', 'Persentase']];

        if ($financialPlan->capital_sources) {
            foreach ($financialPlan->capital_sources as $source) {
                $capitalData[] = [
                    $source['source'] ?? 'Tidak ada nama',
                    'Rp ' . number_format($source['amount'] ?? 0, 0, ',', '.'),
                    ($source['percentage'] ?? 0) . '%'
                ];
            }
        }

        $capitalData[] = [
            'TOTAL',
            'Rp ' . number_format($financialPlan->total_initial_capital ?? 0, 0, ',', '.'),
            '100%'
        ];

        return $capitalData;
    }

    /**
     * Generate expense breakdown data untuk PDF
     */
    private function generateExpenseBreakdownData($financialPlan)
    {
        $expenseData = [['Kategori Biaya', 'Jumlah (Rp/Bulan)']];

        if (!$financialPlan->monthly_opex || count($financialPlan->monthly_opex) === 0) {
            $expenseData = array_merge($expenseData, [
                ['Biaya Sewa/Tempat', 'Rp ' . number_format(0, 0, ',', '.')],
                ['Biaya Listrik/Air', 'Rp ' . number_format(0, 0, ',', '.')],
                ['Biaya Gaji', 'Rp ' . number_format(0, 0, ',', '.')],
                ['Biaya Bahan Baku', 'Rp ' . number_format(0, 0, ',', '.')],
                ['Biaya Pemasaran', 'Rp ' . number_format(0, 0, ',', '.')],
                ['Biaya Lain-lain', 'Rp ' . number_format(0, 0, ',', '.')]
            ]);
        } else {
            foreach ($financialPlan->monthly_opex as $expense) {
                $expenseData[] = [
                    $expense['category'] ?? 'Biaya Lainnya',
                    'Rp ' . number_format($expense['amount'] ?? 0, 0, ',', '.')
                ];
            }
        }

        $expenseData[] = [
            'TOTAL BIAYA OPERASIONAL',
            'Rp ' . number_format($financialPlan->total_monthly_opex ?? 0, 0, ',', '.')
        ];

        return $expenseData;
    }

    /**
     * Generate financial metrics data untuk PDF
     */
    private function generateFinancialMetricsData($financialPlan)
    {
        return [
            ['Metrik Keuangan', 'Nilai'],
            ['ROI (Return on Investment)', ($financialPlan->roi_percentage ?? 0) . '%'],
            ['Payback Period', ($financialPlan->payback_period ?? 0) . ' bulan'],
            ['Profit Margin', ($financialPlan->profit_margin ?? 0) . '%'],
            ['Total Modal Awal', 'Rp ' . number_format($financialPlan->total_initial_capital ?? 0, 0, ',', '.')],
            ['Pendapatan Tahunan', 'Rp ' . number_format($financialPlan->total_yearly_income ?? 0, 0, ',', '.')],
            ['Status Kelayakan', $financialPlan->feasibility_status ?? 'Belum Dianalisis']
        ];
    }

    /**
     * Get PDF statistics and history
     */
    public function getPdfStatistics(Request $request)
    {
        try {
            $userId = Auth::id();

            $businessBackgrounds = BusinessBackground::where('user_id', $userId)->count();
            $recentPlans = BusinessBackground::where('user_id', $userId)
                ->orderBy('updated_at', 'desc')
                ->take(5)
                ->get(['id', 'name', 'updated_at']);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_business_plans' => $businessBackgrounds,
                    'recent_plans' => $recentPlans,
                    'pdf_usage' => [
                        'generated_today' => 0,
                        'generated_this_month' => 0
                    ]
                ],
                'message' => 'PDF statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting PDF statistics: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get PDF statistics'
            ], 500);
        }
    }
}
