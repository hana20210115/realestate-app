import React from 'react';
import { useReviewForm } from '../hooks/useReviewForm';
import StarRating from '../components/StarRating';

const ReviewForm = () => {
    // ロジックから追加した「メモ帳」「ペン」「送信スイッチ」を受け取る
    const { reviewElements, isLoading, scores, handleRatingChange, handleSubmit } = useReviewForm(1);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <p className="text-center text-gray-600 font-bold mt-10">データを読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">口コミ入力</h2>

            <div className="mb-8">
                <ul className="space-y-4">
                    {reviewElements.map((element: any) => (
                        <li key={element.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p className="font-bold text-gray-700">{element.name}</p>
                            
                            {/* 子どもの星部品に、親のメモ帳の点数と、書き込みペンを渡す */}
                            <StarRating 
                                elementId={element.id} 
                                currentScore={scores[element.id] || 0} 
                                onChange={handleRatingChange} 
                            />
                            
                        </li>
                    ))}
                </ul>
            </div>

            {/* 送信ボタンに handleSubmit（送信処理）をセット！ */}
            <button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700"
            >
                送信する
            </button>
        </div>
    );
};

export default ReviewForm;