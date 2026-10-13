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
        
        // 1. 店舗の評価項目（DB）と送信された点数（フロント）を結合
        $elements = $shop->review_elements;
        $scores = $data['scores'];

        // DBの項目数と送信された点数の数が合わない場合はエラー
        if (count($elements) !== count($scores)) {
            abort(400, '評価項目の数が一致しません。');
        }

        $evaluationText = collect($elements)
            ->combine($scores)
            ->map(fn($score, $element) => "・{$element}：{$score}点")
            ->implode("\n");

        // 2. Gemini APIへ送るプロンプトの作成
        $prompt = <<<EOT
あなたは「{$shop->shop_name}」を訪問したお客様です。
以下のアンケート評価に基づいて、Googleマップに投稿する自然な口コミを作成してください。

【評価項目と点数（5点満点）】
{$evaluationText}

【条件】
・AIが書いたとバレないような、自然で人間らしい口調にすること。
・指定された点数が低い項目がある場合は、角が立たないようにマイルドに指摘すること。
・スマホで読みやすい文字数（200文字程度）にすること。
EOT;


        $apiKey = env('GEMINI_API_KEY');
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        // APIエラー時の処理
        if ($response->failed()) {
            abort(500, 'AIの口コミ生成に失敗しました。');
        }

        $generatedText = $response->json('candidates.0.content.parts.0.text');

        // 4. 生成されたテキストをDBに保存
        return Review::create([
            'shop_id' => $data['shop_id'],
            'lottery_result_id' => $data['lottery_result_id'],
            'generated_text' => $generatedText,
        ]);
    }
}