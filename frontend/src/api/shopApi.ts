import axios from 'axios';

// LaravelのAPIの基本URL（ポート番号はLaravel側の設定に合わせます。通常は8000です）
const BASE_URL = 'http://localhost:8000/api';

/**
 * ① 店舗の評価項目（review_elements）をLaravelから取得する関数
 */
export const fetchReviewElements = async (shopId: number) => {
    // 例: GET http://localhost:8000/api/shops/1/review-elements
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
    // 以前Postmanでテストしたのと同じようにPOST送信します
    const response = await axios.post(`${BASE_URL}/reviews`, reviewData);
    return response.data;
};