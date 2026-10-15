import axios from 'axios';

// LaravelのAPIの基本URL
const BASE_URL = 'http://localhost/api';

/**
 * ① 店舗の評価項目（review_elements）をLaravelから取得する関数
 */
export const fetchReviewElements = async (shopId: number) => {
    const response = await axios.get(`${BASE_URL}/shops/${shopId}/review-elements`);
    return response.data; 
};

/**
 * ② お客さんが入力した口コミ結果をLaravelに送信する関数
 */
export const submitReview = async (reviewData: {
    shop_id: number;
    lottery_result_id: number;
    scores: { name: string; score: number }[];
}) => {
    const response = await axios.post(`${BASE_URL}/reviews`, reviewData);
    return response.data;
}; // ← ここでしっかり submitReview を閉じる！

/**
 * ③ 追加：AI口コミ生成APIを叩く関数
 */
export const generateAIReview = async (data: any) => {
    // API_URL ではなく BASE_URL に修正
    const response = await axios.post(`${BASE_URL}/generate-review`, data);
    return response.data; 
};