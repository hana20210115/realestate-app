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