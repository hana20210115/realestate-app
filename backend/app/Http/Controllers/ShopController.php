<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Services\AnalyticsService;

class ShopController extends Controller
{
    protected AnalyticsService $analyticsService;

    // ★コンストラクタでServiceを注入
    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function show(Shop $shop)
    {
        // 店舗データをそのままJSON形式でフロントエンドに返却する
        return response()->json($shop);
    }

    public function analytics($id)
    {
        // ロジックはすべてServiceに任せる
        $data = $this->analyticsService->getShopAnalytics((int) $id);

        return response()->json(array_merge(['status' => 'success'], $data));
    }

    /**
     * 全店舗の一覧を取得する
     */
    public function index()
    {
        // 登録されているすべての店舗を取得
        $shops = Shop::all();
        return response()->json($shops);
    }
}