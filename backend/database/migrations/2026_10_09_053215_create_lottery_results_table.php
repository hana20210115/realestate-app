<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lottery_results', function (Blueprint $table) {
            $table->id();
            // shopsテーブルのidと紐付け（店舗が消えたら結果も消える設定）
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            // Enumの代わりに数値で保存（1:大吉, 2:中吉, 3:小吉）
            $table->tinyInteger('result')->comment('1:大吉, 2:中吉, 3:小吉');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lottery_results');
    }
};
