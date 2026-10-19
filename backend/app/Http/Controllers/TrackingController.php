<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TrackingService;

class TrackingController extends Controller
{
    protected TrackingService $trackingService;

    // ServiceクラスをDI（依存性の注入）で読み込む
    public function __construct(TrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    public function trackRedirect(Request $request)
    {
        // 1. バリデーション（IDが送られてきているか確認）
        $request->validate([
            'lottery_result_id' => 'required|integer'
        ]);

        $lotteryResultId = $request->input('lottery_result_id');

        // 2. 実際の更新ロジックはServiceに任せる（お約束通り！）
        $this->trackingService->recordGoogleRedirect($lotteryResultId);

        // 3. 結果だけを返す
        return response()->json(['status' => 'success']);
    }
}