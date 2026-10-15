import { useState, useEffect } from 'react';
import { fetchReviewElements } from '../api/shopApi';

export const useReviewForm = (shopId: number) => {
    const [reviewElements, setReviewElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    
    // ★追加：どの項目にチェックが入っているかを記憶するメモ帳（例: { 1: true, 2: false }）
    const [selectedElements, setSelectedElements] = useState<{ [key: number]: boolean }>({});

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

    const handleRatingChange = (elementId: number, score: number) => {
        setScores(prev => ({ ...prev, [elementId]: score }));
    };

    // ★追加：チェックボックスを押した時にON/OFFを切り替えるペン
    const handleToggleElement = (elementId: number) => {
        setSelectedElements(prev => ({
            ...prev,
            [elementId]: !prev[elementId] // 今の状態の逆（trueならfalse）にする
        }));
    };

    // ★追加：ルートA（AIで口コミを作成する）ボタンの処理
    const handleAIGenerate = async () => {
        // ※AI機能は次で作るため、今はアラートだけ出します
        alert("ここにAI口コミ生成機能を実装します！\n選択された星の数：" + JSON.stringify(scores));
    };

    // ★追加：ルートB（自分で直接書く）スキップボタンの処理
    const handleSkipToGoogle = () => {
        // ※Google遷移とDB保存（トラッキング）も後で作るため、今はアラートだけ出します
        alert("裏側でクリックログをDBに保存し、各店舗のGoogleビジネスプロフィールへ遷移させます！");
    };

    return {
        reviewElements,
        isLoading,
        scores,
        selectedElements,     // 追加
        handleRatingChange,
        handleToggleElement,  // 追加
        handleAIGenerate,     // 追加
        handleSkipToGoogle    // 追加
    };
};
