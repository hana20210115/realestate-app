<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLotteryRequest;
use App\Services\LotteryService;

class LotteryController extends Controller
{
    private LotteryService $lotteryService;


    public function __construct(LotteryService $lotteryService)
    {
        $this->lotteryService = $lotteryService;
    }


    public function store(StoreLotteryRequest $request)
    {

        $validated = $request->validated();

        $lotteryResult = $this->lotteryService->storeResult($validated);

        return response()->json([
            'message' => 'くじ結果を保存しました',
            'data' => $lotteryResult
        ], 201);
    }
}