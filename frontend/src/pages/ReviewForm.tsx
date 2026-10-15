import React from 'react';
import { useParams } from 'react-router-dom';
import { useReviewForm } from '../hooks/useReviewForm';
import StarRating from '../components/StarRating';

const ReviewForm = () => {
    // URLから店舗IDを取得（文字なのでNumberで数字に変換します）
    const { shopId } = useParams<{ shopId: string }>();
    
    const { 
        reviewElements, 
        isLoading, 
        scores, 
        selectedElements,
        handleRatingChange, 
        handleToggleElement,
        handleAIGenerate,
        handleSkipToGoogle
    } = useReviewForm(Number(shopId) || 1);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-600 font-bold animate-pulse text-xl">データを読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">口コミにご協力ください</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
                評価したい項目にチェックを入れ、<br/>星をタップしてください。
            </p>

            <div className="mb-8">
                <ul className="space-y-4">
                    {reviewElements.map((element: any) => (
                        <li key={element.id} className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedElements[element.id] ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                            
                            {/* チェックボックスと項目名 */}
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    checked={!!selectedElements[element.id]}
                                    onChange={() => handleToggleElement(element.id)}
                                />
                                <span className="ml-3 font-bold text-gray-700 text-lg">{element.name}</span>
                            </label>
                            
                            {/* ★チェックされた時だけ星評価がフワッと開く（アコーディオンUI） */}
                            <div className={`overflow-hidden transition-all duration-300 ${selectedElements[element.id] ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                <StarRating 
                                    elementId={element.id} 
                                    currentScore={scores[element.id] || 0} 
                                    onChange={handleRatingChange} 
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ボタンエリア */}
            <div className="space-y-4 mt-8">
                {/* ルートA：AI生成ボタン（メインアクションなので目立たせる） */}
                <button 
                    onClick={handleAIGenerate}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg flex items-center justify-center"
                >
                    <span className="mr-2">✨</span> AIで口コミを作成する
                </button>

                {/* ルートB：スキップボタン（控えめなデザインにしておく） */}
                <button 
                    onClick={handleSkipToGoogle}
                    className="w-full bg-white text-gray-500 font-bold py-4 rounded-xl border-2 border-gray-300 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all text-sm"
                >
                    自分で直接Googleに書く（スキップ）
                </button>
            </div>
        </div>
    );
};

export default ReviewForm;