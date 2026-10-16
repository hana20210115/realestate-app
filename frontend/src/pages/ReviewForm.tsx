import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useReviewForm } from '../hooks/useReviewForm';
import StarRating from '../components/StarRating';

const ReviewForm = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const location = useLocation();
    const lotteryResultId = location.state?.lotteryResultId;

    const { 
        shopName, reviewElements, isLoading, scores, selectedElements, 
        generatedText, isGenerating, setGeneratedText, 
        handleRatingChange, handleToggleElement, handleAIGenerate, 
        handleCopyToGoogle,
        handleSkipToGoogle
    } = useReviewForm(Number(shopId) || 1, lotteryResultId);

    // 待機中に切り替えるメッセージ集
    const loadingMessages = [
        "あなたの評価をAIが分析中...",
        "自然な言い回しを考えています🤔",
        "良いところをピックアップ中✨",
        "読みやすい文章に整えています...",
        "もうすぐ完成します！"
    ];
    const [messageIndex, setMessageIndex] = useState(0);

    // 生成中のみ2.5秒ごとにメッセージを切り替える
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isGenerating) {
            interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
        } else {
            setMessageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isGenerating]);

    if (isLoading) {
        return (
            <div translate="no" className="min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-600 font-bold animate-pulse text-xl">
                    <span>データを読み込み中...</span>
                </p>
            </div>
        );
    }

    return (
        <div translate="no" className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 transition-all">
            
            {generatedText ? (
                <div key="result" className="animate-fade-in">
                    <h2 className="text-2xl font-black text-gray-800 mb-4 text-center">
                        <span>口コミが完成しました！</span>
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        <span>文章は自由に手直しできます。</span>
                    </p>
                    
                    <textarea 
                        className="w-full h-48 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors text-gray-700 leading-relaxed resize-none"
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                    />

                    <div className="flex flex-col space-y-3 mt-6">
                        <button 
                            type="button"
                            onClick={handleCopyToGoogle}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg flex items-center justify-center"
                        >
                            <span className="mr-2">📋</span>
                            <span>コピーしてGoogleへ進む</span>
                        </button>

                        <div className="flex space-x-3">
                            <button 
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={isGenerating}
                                className="flex-1 bg-white text-blue-600 font-bold py-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all text-sm flex justify-center items-center disabled:opacity-50"
                            >
                                <span>{isGenerating ? '⏳ 生成中...' : '🔄 もう一度生成する'}</span>
                            </button>

                            <button 
                                type="button"
                                onClick={handleSkipToGoogle}
                                className="flex-1 bg-white text-gray-500 font-bold py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm"
                            >
                                <span>スキップしてGoogleで書く</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div key="form">
                    <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
                        <span>{shopName ? `${shopName}の口コミ` : '口コミにご協力ください'}</span>
                    </h2>
                    <p className="text-sm text-gray-500 mb-6 text-center">
                        <span>評価したい項目にチェックを入れ、</span>
                        <br />
                        <span>星をタップしてください。</span>
                    </p>

                    <div className="mb-8">
                        <ul className="space-y-4">
                            {reviewElements.map((element: any) => (
                                <li key={element.id} className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedElements[element.id] ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            checked={!!selectedElements[element.id]}
                                            onChange={() => handleToggleElement(element.id)}
                                        />
                                        <span className="ml-3 font-bold text-gray-700 text-lg">{element.name}</span>
                                    </label>
                                    <div className={`overflow-hidden transition-all duration-300 ${selectedElements[element.id] ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                                        <StarRating elementId={element.id} currentScore={scores[element.id] || 0} onChange={handleRatingChange} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4 mt-8">
                        <button 
                            type="button"
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all flex flex-col items-center justify-center min-h-[64px] ${
                                isGenerating ? 'opacity-90 cursor-not-allowed scale-100' : 'hover:shadow-xl hover:scale-[1.02]'
                            }`}
                        >
                            {isGenerating ? (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-base sm:text-lg animate-pulse">
                                            {loadingMessages[messageIndex]}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center text-lg">
                                    <span className="mr-2">✨</span> 
                                    <span>AIで口コミを作成する</span>
                                </div>
                            )}
                        </button>

                        <button 
                            type="button"
                            onClick={handleSkipToGoogle}
                            disabled={isGenerating}
                            className="w-full bg-white text-gray-500 font-bold py-4 rounded-xl border-2 border-gray-300 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all text-sm disabled:opacity-50"
                        >
                            <span>自分で直接Googleに書く（スキップ）</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;