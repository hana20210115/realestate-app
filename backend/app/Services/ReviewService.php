<?php

namespace App\Services;

use App\Models\Review;
use App\Models\Shop;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReviewService
{
    public function generateAndSaveReview(array $data): Review
    {
        $shop = Shop::findOrFail($data['shop_id']);

        $scores = $data['scores'] ?? [];

        if (empty($scores)) {
            abort(400, '最低1つは評価項目を選択してください。');
        }

        // ★追加：担当者名の受け取り（入力されていない時は null になる）
        $staffName = $data['staff_name'] ?? null;

        // scores の中身を展開してプロンプトにする
        $evaluationText = collect($scores)
            ->map(fn ($item) => "・{$item['name']}：{$item['score']}点")
            ->implode("\n");

        // ★追加：担当者名が入力されている場合のみ、AIへの特別ルールを作成
        $staffInstruction = '';
        if (!empty($staffName)) {
            $staffInstruction = "・担当スタッフの名前は「{$staffName}」さんです。必ずこの名前を口コミの本文に自然に織り込んでください（例：「{$staffName}さんに担当いただいたのですが〜」）。\n";
        }

        // Gemini APIへ送るプロンプトの作成
        $prompt = <<<EOT
あなたは不動産仲介店舗「{$shop->shop_name}」を訪問し、お部屋探しをしたお客様です。
以下のアンケート評価に基づいて、Googleマップに投稿する自然な口コミを作成してください。

【評価項目と点数（5点満点）】
{$evaluationText}

【絶対条件】
・口コミの本文のみを出力してください。「作成しました」「以下の通りです」などの前置き、挨拶、解説、AIとしての発言は【一切禁止】です。
・AIが書いたとバレないような、自然で人間らしい口調にすること。
{$staffInstruction}・指定された点数が低い項目がある場合は、角が立たないようにマイルドに指摘すること。
・スマホで読みやすい文字数（200文字程度）にすること。
EOT;

        // env() ではなく config() 経由で取得（config:cache 後も動く）
        $apiKey = trim((string) config('services.gemini.key'));
        $model  = config('services.gemini.model', 'gemini-3.8-flash');

        if ($apiKey === '') {
            Log::error('Gemini API key is empty. Check GEMINI_API_KEY in .env and run php artisan config:clear.');
            abort(500, 'APIキーが設定されていません。');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        try {
            $response = Http::withHeaders([
                    // キーをURLに載せない（ログや例外メッセージに漏れるのを防ぐ）
                    'x-goog-api-key' => $apiKey,
                ])
                ->acceptJson()
                ->asJson()
                ->withOptions(['force_ip_resolve' => 'v4'])
                ->timeout(30)
                // 429 はリトライしても直らず、むしろ枠を消費するので対象外。
                // 接続エラーと 5xx のみ再試行する。
                ->retry(2, 1000, function ($exception) {
                    if ($exception instanceof ConnectionException) {
                        return true;
                    }

                    return $exception instanceof RequestException
                        && $exception->response->serverError();
                }, throw: false)
                ->post($url, [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]],
                    ],
                ]);
        } catch (ConnectionException $e) {
            Log::error('Gemini API connection error: ' . $e->getMessage());
            abort(503, 'AIサービスに接続できませんでした。時間をおいて再度お試しください。');
        }

        // APIエラー時の処理（本文は省略されずにログへ全文出力される）
        if ($response->failed()) {
            Log::error('Gemini API error', [
                'model'  => $model,
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->status() === 429) {
                abort(429, 'AIの利用上限に達しています。しばらくしてからお試しください。');
            }

            abort(502, '口コミの生成に失敗しました。時間をおいて再度お試しください。');
        }

        $generatedText = $response->json('candidates.0.content.parts.0.text');

        if (empty($generatedText)) {
            Log::error('Gemini API returned no text', [
                'model' => $model,
                'body'  => $response->body(),
            ]);
            abort(502, '口コミの生成結果が空でした。もう一度お試しください。');
        }

        return Review::create([
            'shop_id'           => $data['shop_id'],
            'lottery_result_id' => $data['lottery_result_id'],
            'generated_text'    => $generatedText,
        ]);
    }
}