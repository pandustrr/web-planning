<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductService;
use Illuminate\Support\Facades\Storage;

class ProductServiceController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'type' => 'required|in:product,service',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'advantages' => 'nullable|string',
            'development_strategy' => 'nullable|string',
            'status' => 'nullable|in:draft,in_development,launched'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $imagePath = null;
            if ($request->hasFile('image_path')) {
                $imagePath = $request->file('image_path')->store('product_images', 'public');
            }

            $product = ProductService::create([
                'user_id' => $request->user_id,
                'business_background_id' => $request->business_background_id,
                'type' => $request->type,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'image_path' => $imagePath,
                'advantages' => $request->advantages,
                'development_strategy' => $request->development_strategy,
                'status' => $request->status ?? 'draft',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service created successfully',
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = ProductService::with(['businessBackground', 'user']);

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->business_background_id) {
                $query->where('business_background_id', $request->business_background_id);
            }

            $data = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch products/services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = ProductService::with(['businessBackground', 'user'])->find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = ProductService::find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            // Check ownership
            if ($request->user_id != $product->user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: You cannot update this data'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'business_background_id' => 'required|exists:business_backgrounds,id',
                'type' => 'required|in:product,service',
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'nullable|numeric|min:0',
                'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'advantages' => 'nullable|string',
                'development_strategy' => 'nullable|string',
                'status' => 'nullable|in:draft,in_development,launched'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [
                'business_background_id' => $request->business_background_id,
                'type' => $request->type,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'advantages' => $request->advantages,
                'development_strategy' => $request->development_strategy,
                'status' => $request->status ?? 'draft',
            ];

            // Handle image upload
            if ($request->hasFile('image_path')) {
                // Delete old image if exists
                if ($product->image_path) {
                    Storage::disk('public')->delete($product->image_path);
                }
                $updateData['image_path'] = $request->file('image_path')->store('product_images', 'public');
            }

            $product->update($updateData);

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service updated successfully',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $product = ProductService::find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            // Check ownership
            if ($request->user_id != $product->user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: You cannot delete this data'
                ], 403);
            }

            // Delete image if exists
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }

            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
