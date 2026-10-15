import { useState, useEffect } from 'react';
import { fetchReviewElements } from '../api/shopApi';

export const useReviewForm = (shopId: number) => {
    const [reviewElements, setReviewElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return {
        reviewElements,
        isLoading
    };
};