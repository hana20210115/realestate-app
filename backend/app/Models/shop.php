<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    // セキュリティ対策（SeederやAPIで一括保存を許可するカラム）
    protected $fillable = ['shop_name', 'review_elements', 'google_review_url'];

    // データベースのJSONを、自動的にPHPの配列（array）に変換する魔法の設定
    protected $casts = [
        'review_elements' => 'array',
    ];
}