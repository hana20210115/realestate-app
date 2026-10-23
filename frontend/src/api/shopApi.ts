import axios from 'axios';

// Vercel上の環境変数を優先し、なければローカル環境(localhost)のURLを使用する
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

/**
- 1. 店舗情報（評価項目 review_elements を含む）を取得する関数
 */
export const fetchShop = async (shopId: number) => {
    const response = await axios.get(`${BASE_URL}/shops/${shopId}`);
    return response.data;
};

/**
- 2. おみくじの結果をDBに保存し、発行されたIDを受け取る関数
 */
export const saveLotteryResult = async (data: {
    shop_id: number;
    result: number;
}) => {
    const response = await axios.post(`${BASE_URL}/lotteries/result`, data);
    return response.data;
};

/**
- 3. 本物のGeminiでAI口コミを生成＆DB保存する関数
 */
export const generateAIReview = async (data: {
    shop_id: number;
    lottery_result_id: number;
    scores: { name: string; score: number }[];
    staff_name?: string; // ★ここを追加！(クエスチョンマークは「無くてもOK（任意）」という意味)
}) => {
    const response = await axios.post(`${BASE_URL}/reviews/generate`, data);
    return response.data;
};

/**
- 4. ユーザーがGoogleマップへ遷移したことをバックエンドに記録する
 */
export const trackGoogleRedirect = async (lotteryResultId: number) => {
    const response = await axios.post(`${BASE_URL}/track-redirect`, { lottery_result_id: lotteryResultId });
    return response.data;
};

/**
- 5. 管理者用：店舗情報を更新する関数
 */
export const updateShop = async (shopId: number, data: {
    shop_name: string;
    google_review_url: string;
    review_elements: string[];
}) => {
    const response = await axios.put(`${BASE_URL}/shops/${shopId}`, data);
    return response.data;
};

/**
- 6. 管理者用：店舗の統計データ（ダッシュボード用）を取得する関数
 */
export const fetchShopAnalytics = async (shopId: number) => {
    const response = await axios.get(`${BASE_URL}/shops/${shopId}/analytics`);
    return response.data;
};

/**
- 7. 管理者用：全店舗の一覧を取得する関数
 */
export const fetchAllShops = async () => {
    const response = await axios.get(`${BASE_URL}/shops`);
    return response.data;
};