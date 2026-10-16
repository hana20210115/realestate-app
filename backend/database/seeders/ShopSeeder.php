<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop; // Shopモデルを読み込む

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // 店舗1: 不動産屋パターン（3項目）
        Shop::create([
            'shop_name' => '目黒不動産',
            'review_elements' => ['ファミリー物件に対する知識', '〇〇大学周辺物件への知識', '目黒区エリアについての知識', '売買の知識', '接客態度', 'スピード感', '担当者の安心感'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);


    }
}