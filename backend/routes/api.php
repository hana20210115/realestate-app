<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\LotteryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TrackingController;


Route::get('/shops', [ShopController::class, 'index']);

// 1. 店舗情報の取得（店舗名や review_elements が入っています）
Route::get('/shops/{shop}', [ShopController::class, 'show']);

// 2. おみくじ結果の保存
Route::post('/lotteries/result', [LotteryController::class, 'store']);

// 3. AI口コミ文章の生成＆保存（Service経由で本物のGeminiが動きます）
Route::post('/reviews/generate', [ReviewController::class, 'generate']);

Route::post('/track-redirect', [TrackingController::class, 'trackRedirect']);

// ★この行を追加：統計データ取得用のルート
Route::get('/shops/{id}/analytics', [ShopController::class, 'analytics']);