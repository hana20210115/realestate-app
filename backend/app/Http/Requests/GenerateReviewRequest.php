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
            'shop_id' => 'required|integer',
            'lottery_result_id' => 'required|integer',
            'scores' => 'required|array|min:1',
            'scores.*.name' => 'required|string',
            'scores.*.score' => 'required|integer|min:1|max:5'
        ];
    }
}