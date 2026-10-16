import { useState, useEffect } from 'react';
import { fetchShop, generateAIReview, trackGoogleRedirect } from '../api/shopApi'; // ★重複を解消して綺麗にまとめました

export const useReviewForm = (shopId: number, lotteryResultId?: number) => {
    const [shopName, setShopName] = useState<string>('');
    const [reviewElements, setReviewElements] = useState<{ id: number; name: string }[]>([]);
    const [googleReviewUrl, setGoogleReviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [selectedElements, setSelectedElements] = useState<{ [key: number]: boolean }>({});
    
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const shop = await fetchShop(shopId);
                setShopName(shop.shop_name || '');
                setGoogleReviewUrl(shop.google_review_url || '');

                const rawElements = Array.isArray(shop.review_elements) ? shop.review_elements : [];
                const formatted = rawElements.map((item: any, index: number) => 
                    typeof item === 'string' ? { id: index + 1, name: item } : { id: item.id || index + 1, name: item.name || String(item) }
                );
                setReviewElements(formatted);
            } catch (error) {
                console.error("店舗データの取得失敗", error);
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
        setSelectedElements(prev => {
            const nextState = !prev[elementId];
            if (!nextState) {
                setScores(s => ({ ...s, [elementId]: 0 }));
            }
            return { ...prev, [elementId]: nextState };
        });
    };

    const handleAIGenerate = async () => {
        const checkedItems = reviewElements.filter(el => selectedElements[el.id]);
        if (checkedItems.length === 0) {
            alert("評価したい項目にチェックを入れてください。");
            return;
        }

        const hasUnratedItem = checkedItems.some(el => !scores[el.id] || scores[el.id] < 1);
        if (hasUnratedItem) {
            alert("チェックを入れた項目の「星（1〜5）」をタップして選択してください。");
            return;
        }

        const formattedScores = checkedItems.map(el => ({
            name: el.name,
            score: scores[el.id]
        }));

        setIsGenerating(true);
        try {
            const response = await generateAIReview({
                shop_id: shopId,
                lottery_result_id: lotteryResultId || 1,
                scores: formattedScores
            });
            
            const text = response?.data?.generated_text ?? response?.generated_text;

            if (typeof text === 'string' && text.length > 0) {
                setGeneratedText(text);
            } else {
                console.error("予期しないレスポンス形式:", response);
                alert("文章がうまく取り出せませんでした。");
            }
        } catch (error: any) {
            console.error("AI生成エラー詳細:", error.response?.data || error);
            const errorMsg = error.response?.data?.message || "文章の生成に失敗しました。";
            alert(`エラー: ${errorMsg}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyToGoogle = async () => {
        if (!generatedText) return;
        
        try {
            await navigator.clipboard.writeText(generatedText);
            alert("口コミをコピーしました！\nGoogleマップが開いたら「貼り付け」して投稿してください。");
            
            // ★追加：別タブが開く裏側でこっそりAPIを叩いてDBに記録を残す
            if (lotteryResultId) {
                trackGoogleRedirect(lotteryResultId).catch(err => console.error("トラッキングエラー:", err));
            }

            if (googleReviewUrl) {
                window.open(googleReviewUrl, '_blank');
            } else {
                alert("店舗のGoogleマップURLが設定されていません。");
            }
        } catch (error) {
            console.error("コピー失敗:", error);
            alert("コピーに失敗しました。テキストを手動でコピーしてから進んでください。");
        }
    };

    const handleSkipToGoogle = () => {
        // ★追加：スキップ時も同様にDBに記録を残す
        if (lotteryResultId) {
            trackGoogleRedirect(lotteryResultId).catch(err => console.error("トラッキングエラー:", err));
        }

        if (googleReviewUrl) {
            window.open(googleReviewUrl, '_blank');
        } else {
            alert("店舗のGoogleマップURLが設定されていません。");
        }
    };

    return {
        shopName,
        reviewElements,
        isLoading,
        scores,
        selectedElements,
        generatedText,
        isGenerating,
        setGeneratedText,
        handleRatingChange,
        handleToggleElement,
        handleAIGenerate,
        handleCopyToGoogle,
        handleSkipToGoogle
    };
};