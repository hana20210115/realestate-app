<?php

namespace App\Services;

use App\Models\Shop;
use App\Models\Review;
use Illuminate\Support\Facades\Http;

class ReviewService
{
    public function generateAndSaveReview(array $data): Review
    {
        $shop = Shop::findOrFail($data['shop_id']);
        
        
        $scores = $data['scores'] ?? [];

        if (empty($scores)) {
            abort(400, '最低1つは評価項目を選択してください。');
        }

        // scores の中身を展開してプロンプトにする
        $evaluationText = collect($scores)
            ->map(fn($item) => "・{$item['name']}：{$item['score']}点")
            ->implode("\n");

        // 2. Gemini APIへ送るプロンプトの作成
        $prompt = <<<EOT
あなたは不動産仲介店舗「{$shop->shop_name}」を訪問し、お部屋探しをしたお客様です。
以下のアンケート評価に基づいて、Googleマップに投稿する自然な口コミを作成してください。

【評価項目と点数（5点満点）】
{$evaluationText}

【条件】
・AIが書いたとバレないような、自然で人間らしい口調にすること。
・指定された点数が低い項目がある場合は、角が立たないようにマイルドに指摘すること。
・スマホで読みやすい文字数（200文字程度）にすること。
EOT;

        $apiKey = env('GEMINI_API_KEY');

$apiKey = env('GEMINI_API_KEY');

        // 安全対策: APIキーが空っぽの場合はここで止める
        if (empty($apiKey)) {
            abort(500, 'エラー: APIキーが空っぽです!Laravelが.envを読み込めていません。');
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',

        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . trim($apiKey), [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        // APIエラー時の処理
        if ($response->failed()) {
            abort(500, 'Geminiエラー詳細: ' . $response->body());
        }

        $generatedText = $response->json('candidates.0.content.parts.0.text');

        return Review::create([
            'shop_id' => $data['shop_id'],
            'lottery_result_id' => $data['lottery_result_id'],
            'generated_text' => $generatedText,
        ]);
    }
}