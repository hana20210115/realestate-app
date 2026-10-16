<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LotteryResult extends Model
{
    use HasFactory;

    // ① トラッキング用のカラムを fillable に追加
    protected $fillable = [
        'shop_id', 
        'result', 
        'redirected_to_google_at' // ← 追加
    ];

    // ② 日付として扱うためのキャストを追加（重要）
    protected $casts = [
        'redirected_to_google_at' => 'datetime', // ← 追加
    ];

    // ③ （おまけ）Shopテーブルとのリレーションを書いておくと後で便利です
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}