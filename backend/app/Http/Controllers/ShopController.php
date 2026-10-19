<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateShopRequest;
use App\Services\AnalyticsService;
use App\Services\ShopService; 

class ShopController extends Controller
{
    protected AnalyticsService $analyticsService;
    protected ShopService $shopService;

    // ★コンストラクタで2つのServiceを注入
    public function __construct(AnalyticsService $analyticsService, ShopService $shopService)
    {
        $this->analyticsService = $analyticsService;
        $this->shopService = $shopService;
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

    /**
     * 特定の店舗データを取得する
     */
    public function show(Shop $shop)
    {
        // 店舗データをそのままJSON形式でフロントエンドに返却する
        return response()->json($shop);
    }

    /**
     * 店舗設定を更新する
     */
    public function update(UpdateShopRequest $request, Shop $shop)
    {
        // バリデーション済みのデータをServiceに渡して更新処理を委譲
        $updatedShop = $this->shopService->updateShop($shop, $request->validated());

        return response()->json([
            'message' => '店舗設定を更新しました',
            'shop' => $updatedShop
        ]);
    }

    /**
     * ダッシュボード用の統計データを取得する
     */
    public function analytics($id)
    {
        // ロジックはすべてAnalyticsServiceに任せる
        $data = $this->analyticsService->getShopAnalytics((int) $id);

        return response()->json(array_merge(['status' => 'success'], $data));
    }
}