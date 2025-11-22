<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessBackground;
use App\Models\MarketAnalysis;
use App\Models\ProductService;
use App\Models\MarketingStrategy;
use App\Models\OperationalPlan;
use App\Models\TeamStructure;
use App\Models\FinancialPlan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\PersonalAccessToken;

class PdfBusinessPlanController extends Controller
{
    /**
     * Verify token dari query parameter
     */
    private function verifyToken(Request $request)
    {
        $token = $request->input('token');

        if (!$token) {
            return null;
        }

        // Find token in database
        $accessToken = PersonalAccessToken::findToken($token);

        if (!$accessToken) {
            return null;
        }

        return $accessToken->tokenable;
    }

    /**
     * Generate PDF untuk Business Plan
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function generatePdf(Request $request)
    {
        try {
            // Verify token
            $user = $this->verifyToken($request);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $userId = $request->input('user_id');
            $isPro = $request->input('is_pro', false) === 'true';

            // Validasi user_id
            if (!$userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ID is required'
                ], 400);
            }

            // Verify user owns this data
            if ($user->id != $userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Ambil semua data business plan
            $businessBackground = BusinessBackground::where('user_id', $userId)->first();

            if (!$businessBackground) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background not found'
                ], 404);
            }

            // Ambil data terkait lainnya
            $marketAnalyses = MarketAnalysis::where('business_background_id', $businessBackground->id)
                ->with('competitors')
                ->get();

            $productServices = ProductService::where('business_background_id', $businessBackground->id)->get();

            $marketingStrategies = MarketingStrategy::where('business_background_id', $businessBackground->id)->get();

            $operationalPlans = OperationalPlan::where('business_background_id', $businessBackground->id)->get();

            $teamStructures = TeamStructure::where('business_background_id', $businessBackground->id)->get();

            $financialPlans = FinancialPlan::where('business_background_id', $businessBackground->id)->get();

            // Convert logo to base64 if exists
            $logoBase64 = null;
            if ($businessBackground->logo) {
                $logoPath = storage_path('app/public/' . $businessBackground->logo);
                if (file_exists($logoPath)) {
                    $imageData = base64_encode(file_get_contents($logoPath));
                    $imageType = pathinfo($logoPath, PATHINFO_EXTENSION);
                    $logoBase64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                }
            }

            // Convert team photos to base64
            foreach ($teamStructures as $team) {
                if ($team->photo) {
                    $photoPath = storage_path('app/public/' . $team->photo);
                    if (file_exists($photoPath)) {
                        $imageData = base64_encode(file_get_contents($photoPath));
                        $imageType = pathinfo($photoPath, PATHINFO_EXTENSION);
                        $team->photo_base64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                    }
                }
            }

            // Convert product images to base64
            foreach ($productServices as $product) {
                if ($product->image) {
                    $imagePath = storage_path('app/public/' . $product->image);
                    if (file_exists($imagePath)) {
                        $imageData = base64_encode(file_get_contents($imagePath));
                        $imageType = pathinfo($imagePath, PATHINFO_EXTENSION);
                        $product->image_base64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                    }
                }
            }

            // Prepare data for PDF
            $data = [
                'businessBackground' => $businessBackground,
                'logoBase64' => $logoBase64,
                'marketAnalyses' => $marketAnalyses,
                'productServices' => $productServices,
                'marketingStrategies' => $marketingStrategies,
                'operationalPlans' => $operationalPlans,
                'teamStructures' => $teamStructures,
                'financialPlans' => $financialPlans,
                'isPro' => $isPro,
                'generatedAt' => now()->format('d F Y H:i'),
            ];

            // Generate PDF
            $pdf = Pdf::loadView('pdf.business-plan', $data);

            // Set paper size and orientation
            $pdf->setPaper('a4', 'portrait');

            // Set options
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'sans-serif',
                'margin_top' => 10,
                'margin_bottom' => 10,
                'margin_left' => 10,
                'margin_right' => 10,
            ]);

            // Generate filename
            $filename = 'Business-Plan-' . str_replace(' ', '-', $businessBackground->name) . '-' . now()->format('Y-m-d') . '.pdf';

            // Return PDF as download
            return $pdf->download($filename);

        } catch (\Exception $e) {
            Log::error('Error generating PDF: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Preview PDF (untuk testing)
     */
    public function previewPdf(Request $request)
    {
        try {
            // Verify token
            $user = $this->verifyToken($request);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 401);
            }

            $userId = $request->input('user_id');
            $isPro = $request->input('is_pro', false) === 'true';

            if (!$userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User ID is required'
                ], 400);
            }

            // Verify user owns this data
            if ($user->id != $userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $businessBackground = BusinessBackground::where('user_id', $userId)->first();

            if (!$businessBackground) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Business background not found'
                ], 404);
            }

            $marketAnalyses = MarketAnalysis::where('business_background_id', $businessBackground->id)
                ->with('competitors')
                ->get();

            $productServices = ProductService::where('business_background_id', $businessBackground->id)->get();
            $marketingStrategies = MarketingStrategy::where('business_background_id', $businessBackground->id)->get();
            $operationalPlans = OperationalPlan::where('business_background_id', $businessBackground->id)->get();
            $teamStructures = TeamStructure::where('business_background_id', $businessBackground->id)->get();
            $financialPlans = FinancialPlan::where('business_background_id', $businessBackground->id)->get();

            // Convert images to base64
            $logoBase64 = null;
            if ($businessBackground->logo) {
                $logoPath = storage_path('app/public/' . $businessBackground->logo);
                if (file_exists($logoPath)) {
                    $imageData = base64_encode(file_get_contents($logoPath));
                    $imageType = pathinfo($logoPath, PATHINFO_EXTENSION);
                    $logoBase64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                }
            }

            foreach ($teamStructures as $team) {
                if ($team->photo) {
                    $photoPath = storage_path('app/public/' . $team->photo);
                    if (file_exists($photoPath)) {
                        $imageData = base64_encode(file_get_contents($photoPath));
                        $imageType = pathinfo($photoPath, PATHINFO_EXTENSION);
                        $team->photo_base64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                    }
                }
            }

            foreach ($productServices as $product) {
                if ($product->image) {
                    $imagePath = storage_path('app/public/' . $product->image);
                    if (file_exists($imagePath)) {
                        $imageData = base64_encode(file_get_contents($imagePath));
                        $imageType = pathinfo($imagePath, PATHINFO_EXTENSION);
                        $product->image_base64 = 'data:image/' . $imageType . ';base64,' . $imageData;
                    }
                }
            }

            $data = [
                'businessBackground' => $businessBackground,
                'logoBase64' => $logoBase64,
                'marketAnalyses' => $marketAnalyses,
                'productServices' => $productServices,
                'marketingStrategies' => $marketingStrategies,
                'operationalPlans' => $operationalPlans,
                'teamStructures' => $teamStructures,
                'financialPlans' => $financialPlans,
                'isPro' => $isPro,
                'generatedAt' => now()->format('d F Y H:i'),
            ];

            $pdf = Pdf::loadView('pdf.business-plan', $data);
            $pdf->setPaper('a4', 'portrait');

            // Stream PDF to browser
            return $pdf->stream('business-plan-preview.pdf');

        } catch (\Exception $e) {
            Log::error('Error previewing PDF: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to preview PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
