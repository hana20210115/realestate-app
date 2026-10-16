<?php

namespace App\Services;

use App\Models\LotteryResult;
use Illuminate\Support\Facades\Log;

class TrackingService
{
    /**
     * Googleマップへ遷移した日時を記録する
     */
    public function recordGoogleRedirect(int $lotteryResultId): void
    {
        try {
            // Eloquentモデルを使ってデータを取得
            $lotteryResult = LotteryResult::find($lotteryResultId);

            if ($lotteryResult) {
                // プロパティを更新して保存
                $lotteryResult->redirected_to_google_at = now();
                $lotteryResult->save();
            }
        } catch (\Exception $e) {
            // トラッキングの失敗でシステム全体を止めないようログだけ残す
            Log::error('トラッキングの保存に失敗しました: ' . $e->getMessage());
        }
    }
}