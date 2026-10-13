<?php

namespace App\Services;

use App\Models\LotteryResult;

class LotteryService
{
    /**
     * くじ引き結果をデータベースに保存する
     */
    public function storeResult(array $data): LotteryResult
    {
        return LotteryResult::create($data);
    }
}