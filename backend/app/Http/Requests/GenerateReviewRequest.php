<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shop_id' => 'required|exists:shops,id',
            'lottery_result_id' => 'required|exists:lottery_results,id',
            'scores' => 'required|array',
            'scores.*' => 'required|integer|min:1|max:5', // 配列の中身は1〜5のみ
        ];
    }
}