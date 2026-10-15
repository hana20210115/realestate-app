import { useState, useEffect } from 'react';
// さっき追加した generateAIReview をインポートに追加
import { fetchReviewElements, generateAIReview } from '../api/shopApi';

export const useReviewForm = (shopId: number) => {
    const [reviewElements, setReviewElements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [selectedElements, setSelectedElements] = useState<{ [key: number]: boolean }>({});
    
    // ★追加：生成されたAIの文章と、生成中（ローディング）状態を管理するメモ帳
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchReviewElements(shopId);
                setReviewElements(data);
            } catch (error) {
                console.error("データ取得失敗", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [shopId]);

    const handleRatingChange = (elementId: number, score: number) => {
        setScores(prev => ({ ...prev, [elementId]: score }));
    };

    const handleToggleElement = (elementId: number) => {
        setSelectedElements(prev => ({
            ...prev,
            [elementId]: !prev[elementId]
        }));
    };

    // ★大改造：AIで口コミを作成する処理
    const handleAIGenerate = async () => {
        setIsGenerating(true);
        try {
            // チェックされた項目だけのデータを作る
            const formattedScores = reviewElements
                .filter(el => selectedElements[el.id])
                .map(el => ({
                    name: el.name,
                    score: scores[el.id] || 0
                }));

            // Laravelの窓口に送信！
            const response = await generateAIReview({ scores: formattedScores });
            
            // 返ってきた文章をメモ帳（State）に保存して画面を切り替える
            setGeneratedText(response.generated_text);
        } catch (error) {
            console.error("AI生成エラー", error);
            alert("文章の生成に失敗しました。");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSkipToGoogle = () => {
        alert("裏側でクリックログをDBに保存し、Googleへ遷移します！");
    };

    return {
        reviewElements,
        isLoading,
        scores,
        selectedElements,
        generatedText,      // 追加
        isGenerating,       // 追加
        setGeneratedText,   // 追加（手直し用）
        handleRatingChange,
        handleToggleElement,
        handleAIGenerate,
        handleSkipToGoogle
    };
};