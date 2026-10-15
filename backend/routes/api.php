<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\LotteryController;
use App\Http\Controllers\ReviewController;

// 1. 店舗情報の取得（Reactの初回読み込み時）
Route::get('/shops/{shop}', [ShopController::class, 'show']);

// 2. くじ結果の保存
Route::post('/lotteries/result', [LotteryController::class, 'store']);

// 3. AI口コミ文章の生成＆保存
Route::post('/reviews/generate', [ReviewController::class, 'generate']);

Route::get('/shops/{shop}/review-elements', function () {
    // テスト用に、仮のデータ（JSON）をReactに直接返します
    return response()->json([
        ['id' => 1, 'name' => '接客態度'],
        ['id' => 2, 'name' => '店舗の清潔感'],
        ['id' => 3, 'name' => '物件の提案力'],
    ]);
});