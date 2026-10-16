import axios from 'axios';

const BASE_URL = 'http://localhost/api';

/**
- 店舗情報（評価項目 review_elements を含む）を取得する関数
 */
export const fetchShop = async (shopId: number) => {
    const response = await axios.get(`${BASE_URL}/shops/${shopId}`);
    return response.data;
};

/**
- 2. おみくじの結果をDBに保存し、発行されたIDを受け取る関数
-    result は 1:大吉, 2:中吉, 3:小吉 の数値
 */
export const saveLotteryResult = async (data: {
    shop_id: number;
    result: number;
}) => {
    const response = await axios.post(`${BASE_URL}/lotteries/result`, data);
    return response.data; // { message: '...', data: { id: 1, ... } }
};

/**
- 3. 本物のGeminiでAI口コミを生成＆DB保存する関数
 */
export const generateAIReview = async (data: {
    shop_id: number;
    lottery_result_id: number;
    scores: { name: string; score: number }[];
}) => {
    const response = await axios.post(`${BASE_URL}/reviews/generate`, data);
    return response.data; // { message: '...', data: { generated_text: '...' } }
};

/**
- 4. ユーザーがGoogleマップへ遷移したことをバックエンドに記録する
 */
export const trackGoogleRedirect = async (lotteryResultId: number) => {
    // ★ ここを他の関数と同じように `${BASE_URL}` を使うように修正しました！
    const response = await axios.post(`${BASE_URL}/track-redirect`, { lottery_result_id: lotteryResultId });
    return response.data;
};