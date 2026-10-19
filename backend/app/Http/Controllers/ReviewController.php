<?php

namespace App\Http\Controllers;

use App\Http\Requests\GenerateReviewRequest;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    private ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function generate(GenerateReviewRequest $request)
    {
        // バリデーション済みのデータを取得
        $validated = $request->validated();

        // Geminiでの生成＆DB保存をServiceに依頼
        $review = $this->reviewService->generateAndSaveReview($validated);

        return response()->json([
            'message' => '口コミの生成に成功しました',
            'data' => $review
        ], 201);
    }
}
