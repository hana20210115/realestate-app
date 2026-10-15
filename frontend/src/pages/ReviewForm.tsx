import React from 'react';
import { useParams } from 'react-router-dom';
import { useReviewForm } from '../hooks/useReviewForm';
import StarRating from '../components/StarRating';

const ReviewForm = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const { 
        reviewElements, isLoading, scores, selectedElements, 
        generatedText, isGenerating, setGeneratedText, 
        handleRatingChange, handleToggleElement, handleAIGenerate, handleSkipToGoogle
    } = useReviewForm(Number(shopId) || 1);

    const handleCopyAndGo = async () => {
        if (generatedText) {
            await navigator.clipboard.writeText(generatedText);
            alert("口コミをコピーしました！\nこの後、遷移先のGoogleマップに貼り付けてください。");
        }
    };

    if (isLoading) return <div className="min-h-screen bg-gray-100 flex justify-center items-center"><p className="text-gray-600 font-bold animate-pulse text-xl">データを読み込み中...</p></div>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 transition-all">
            
            {generatedText ? (
                <div className="animate-fade-in-up">
                    <h2 className="text-2xl font-black text-gray-800 mb-4 text-center">口コミが完成しました！</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">文章は自由に手直しできます。</p>
                    
                    <textarea 
                        className="w-full h-48 p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors text-gray-700 leading-relaxed resize-none"
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                    />

                    {/* ▼ 変更：ボタンエリアをリッチにしました */}
                    <div className="flex flex-col space-y-3 mt-6">
                        <button 
                            onClick={handleCopyAndGo}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg flex items-center justify-center"
                        >
                            <span className="mr-2">📋</span> コピーしてGoogleへ進む
                        </button>

                        <div className="flex space-x-3">
                            <button 
                                onClick={handleAIGenerate}
                                disabled={isGenerating}
                                className="flex-1 bg-white text-blue-600 font-bold py-3 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all text-sm flex justify-center items-center disabled:opacity-50"
                            >
                                {isGenerating ? '⏳ 生成中...' : '🔄 もう一度生成する'}
                            </button>

                            <button 
                                onClick={handleSkipToGoogle}
                                className="flex-1 bg-white text-gray-500 font-bold py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm"
                            >
                                スキップしてGoogleで書く
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* 入力画面（変更なし） */
                <div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">口コミにご協力ください</h2>
                    <p className="text-sm text-gray-500 mb-6 text-center">評価したい項目にチェックを入れ、<br/>星をタップしてください。</p>

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
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-lg flex items-center justify-center disabled:opacity-50"
                        >
                            <span className="mr-2">{isGenerating ? '⏳' : '✨'}</span> 
                            {isGenerating ? '口コミを生成中...' : 'AIで口コミを作成する'}
                        </button>

                        <button 
                            onClick={handleSkipToGoogle}
                            className="w-full bg-white text-gray-500 font-bold py-4 rounded-xl border-2 border-gray-300 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all text-sm"
                        >
                            自分で直接Googleに書く（スキップ）
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;