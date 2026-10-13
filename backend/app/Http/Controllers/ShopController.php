<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function show(Shop $shop)
    {
        // 店舗データをそのままJSON形式でフロントエンドに返却する
        return response()->json($shop);
    }
}