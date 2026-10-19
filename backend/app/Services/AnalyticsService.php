<?php

namespace App\Services;

use App\Models\Shop;
use App\Models\LotteryResult;

class AnalyticsService
{
    /**
     * 店舗の統計データ（おみくじ結果・遷移率など）を集計して返す
     */
    public function getShopAnalytics(int $shopId): array
    {
        $shop = Shop::findOrFail($shopId);

        // 1. おみくじの総数
        $totalDraws = LotteryResult::where('shop_id', $shopId)->count();

        // 2. おみくじ結果ごとの回数
        $daikichi = LotteryResult::where('shop_id', $shopId)->where('result', 1)->count();
        $chukichi = LotteryResult::where('shop_id', $shopId)->where('result', 2)->count();
        $shokichi = LotteryResult::where('shop_id', $shopId)->where('result', 3)->count();

        // 3. Googleへ遷移した（トラッキングされた）人数
        $redirectedCount = LotteryResult::where('shop_id', $shopId)
            ->whereNotNull('redirected_to_google_at')
            ->count();

        // 4. コンバージョン率（遷移率）を計算
        $conversionRate = $totalDraws > 0 
            ? round(($redirectedCount / $totalDraws) * 100, 1) 
            : 0;

        // 集計結果を配列で返す
        return [
            'shop_name' => $shop->shop_name,
            'stats' => [
                'total_draws' => $totalDraws,
                'redirected_count' => $redirectedCount,
                'conversion_rate' => $conversionRate,
            ],
            'lottery_ratios' => [
                ['name' => '大吉', 'value' => $daikichi, 'color' => '#ef4444'],
                ['name' => '中吉', 'value' => $chukichi, 'color' => '#f59e0b'],
                ['name' => '小吉', 'value' => $shokichi, 'color' => '#10b981'],
            ]
        ];
    }
}