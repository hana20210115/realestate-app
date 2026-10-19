<?php

namespace App\Services;

use App\Models\Shop;

class ShopService
{
    /**
     * 店舗情報を更新する
     *
     * @param Shop $shop
     * @param array $data
     * @return Shop
     */
    public function updateShop(Shop $shop, array $data): Shop
    {
        $shop->update($data);
        
        return $shop;
    }
}