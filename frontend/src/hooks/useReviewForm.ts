import { useState, useEffect } from 'react';
// ① さっき作った submitReview（データ送信用の関数）も読み込みます
import { fetchReviewElements, submitReview } from '../api/shopApi';

export const useReviewForm = (shopId: number) => {
    const [reviewElements, setReviewElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ② 親が持つ新しいメモ帳：お客さんがつけた点数を記憶します（例: { 1: 5, 2: 3 }）
    const [scores, setScores] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchReviewElements(shopId);
                setReviewElements(data);
            } catch (error) {
                console.error("データの取得に失敗しました", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [shopId]);

    // ③ 子ども（星部品）に渡す「書き込み用のペン（関数）」
    const handleRatingChange = (elementId: number, score: number) => {
        // 「今までの点数データに、新しい項目と点数を合体させて保存して！」という処理
        setScores(prev => ({ ...prev, [elementId]: score }));
    };

    // ④ 「送信する」ボタンが押された時の処理
    const handleSubmit = async () => {
        try {
            // Laravelのバリデーションルールに合わせてデータを綺麗な形に整える
            const formattedScores = reviewElements.map(element => ({
                name: element.name,
                score: scores[element.id] || 0 // まだ押されていなければ0点にする
            }));

            // 送信用の荷物をまとめる
            const reviewData = {
                shop_id: shopId,
                lottery_result_id: 1, // テスト用として一旦1番を入れます
                scores: formattedScores
            };

            // shopApi.tsの関数を使ってLaravelへPOST送信！
            await submitReview(reviewData);
            alert("口コミの送信が完了しました！");
            
        } catch (error) {
            console.error("送信エラー", error);
            alert("送信に失敗しました。");
        }
    };

    // 画面側（View）に渡すものを追加
    return {
        reviewElements,
        isLoading,
        scores,             // 追加：点数のメモ帳
        handleRatingChange, // 追加：書き込み用のペン
        handleSubmit        // 追加：送信ボタン用スイッチ
    };
};