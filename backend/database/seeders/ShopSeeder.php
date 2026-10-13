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
            'shop_name' => '渋谷不動産',
            'review_elements' => ['接客・対応', '提案力・知識', 'スピード感'],
        ]);

        // 店舗2: 飲食店パターン（4項目）
        Shop::create([
            'shop_name' => '新宿カフェ',
            'review_elements' => ['料理の味', '提供スピード', '店内の雰囲気', 'コスパ'],
        ]);

        // 店舗3: 美容室パターン（3項目 - 文言違い）
        Shop::create([
            'shop_name' => '池袋ヘアサロン',
            'review_elements' => ['カウンセリングの丁寧さ', '仕上がりの満足度', 'シャンプーの快適さ'],
        ]);
    }
}