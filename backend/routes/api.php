<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\LotteryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Artisan;

// ▼ 店舗管理関連のルート
Route::get('/shops', [ShopController::class, 'index']);
Route::get('/shops/{shop}', [ShopController::class, 'show']);
Route::put('/shops/{shop}', [ShopController::class, 'update']); // ★店舗設定の更新（追加完了！）
Route::get('/shops/{id}/analytics', [ShopController::class, 'analytics']);

// ▼ お客様のアクション関連のルート
Route::post('/lotteries/result', [LotteryController::class, 'store']);
Route::post('/reviews/generate', [ReviewController::class, 'generate']);
Route::post('/track-redirect', [TrackingController::class, 'trackRedirect']);

Route::get('/run-seed', function () {
    Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
    return 'Render本番DBへのデータ投入が完了しました！';
});
