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

// ▼ ここから追加：Reactからの口コミデータ(POST)を受け取る窓口
Route::post('/reviews', function (\Illuminate\Http\Request $request) {
    // ひとまずデータベース保存は置いておき、「無事に受け取ったよ！」という成功のサインをReactに返します
    return response()->json([
        'message' => 'データ受信成功！',
        'received_data' => $request->all() // Reactから送られてきた荷物の中身
    ], 200);
});

// ▼ 追加：AI口コミ生成用の窓口（仮のAIとして動作します）
Route::post('/generate-review', function (\Illuminate\Http\Request $request) {
    $scores = $request->input('scores', []);
    
    // ※後日、ここにChatGPT APIを呼び出す処理を書きます！
    // 今回はテストとして、星の点数を元にプログラムで簡単な文章を組み立てます
    $text = "先日こちらの店舗を利用させていただきました。\n";
    $hasGoodPoint = false;

    foreach($scores as $item) {
        if($item['score'] >= 4) {
            $text .= "特に「{$item['name']}」が素晴らしく、とても満足しています！\n";
            $hasGoodPoint = true;
        } elseif ($item['score'] > 0) {
            $text .= "「{$item['name']}」についても良かったです。\n";
        }
    }

    if (!$hasGoodPoint) {
        $text .= "全体的にスムーズな対応をしていただけました。\n";
    }
    
    $text .= "また機会があればぜひ利用したいと思います。ありがとうございました！";

    return response()->json([
        'generated_text' => $text
    ], 200);
});