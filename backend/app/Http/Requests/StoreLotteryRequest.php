<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLotteryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        return [
            'shop_id' => 'required|exists:shops,id',
            'result'  => 'required|integer|in:1,2,3',
        ];
    }
}