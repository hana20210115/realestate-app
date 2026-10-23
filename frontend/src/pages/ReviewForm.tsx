import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchShop, generateAIReview, trackGoogleRedirect } from '../api/shopApi';

const ReviewForm = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const location = useLocation();

    // おみくじ画面から渡されたIDを取得
    const lotteryResultId = location.state?.lotteryResultId;

    const [shop, setShop] = useState<any>(null);
    const [reviewElements, setReviewElements] = useState<string[]>([]);
    const [ratings, setRatings] = useState<Record<string, number>>({});
    
    const [isLoadingShop, setIsLoadingShop] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedReview, setGeneratedReview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // ★追加：担当者名を記憶しておくための箱
    const [staffName, setStaffName] = useState<string>('');

    // 1. 店舗データと評価項目を取得
    useEffect(() => {
        const loadShop = async () => {
            try {
                const shopData = await fetchShop(Number(shopId));
                setShop(shopData);
                
                const elements = Array.isArray(shopData.review_elements) 
                    ? shopData.review_elements.map((el: any) => typeof el === 'string' ? el : el.name)
                    : [];
                
                const finalElements = elements.length > 0 ? elements : ['総合評価'];
                setReviewElements(finalElements);

                const initialRatings: Record<string, number> = {};
                finalElements.forEach((el: string) => {
                    initialRatings[el] = 0;
                });
                setRatings(initialRatings);
            } catch (err) {
                console.error('店舗情報の取得に失敗しました', err);
                setError('店舗情報の読み込みに失敗しました。');
            } finally {
                setIsLoadingShop(false);
            }
        };
        loadShop();
    }, [shopId]);

    // 2. 星をクリックした時の処理（同じ星でキャンセル）
    const handleStarClick = (element: string, score: number) => {
        setRatings(prev => {
            if (prev[element] === score) {
                return { ...prev, [element]: 0 };
            }
            return { ...prev, [element]: score };
        });
    };

    const handleClear = (element: string) => {
        setRatings(prev => ({ ...prev, [element]: 0 }));
    };

    // 3. AIに口コミ作成を依頼する処理（初回＆再生成 共通）
    const handleSubmit = async () => {
        const ratedItems = Object.entries(ratings).filter(([name, score]) => score > 0);
        
        if (ratedItems.length === 0) {
            alert('少なくとも1つの項目には星をつけてください！🌟\n（AIを使わずに自分で書く場合は、一番下のボタンを押してください）');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const scoresArray = ratedItems.map(([name, score]) => ({ name, score }));

            const res = await generateAIReview({
                shop_id: Number(shopId),
                lottery_result_id: lotteryResultId || 1, // テスト用に直接開いた場合のエラーを回避
                scores: scoresArray,
                staff_name: staffName // ★追加：箱の中身をLaravelに渡す
            });

            const reviewText = res.generated_text || (res.data && res.data.generated_text) || res.review_text;
            
            if (!reviewText || typeof reviewText !== 'string') {
                throw new Error("AIから正しい文章データが返ってきませんでした");
            }
            
            setGeneratedReview(reviewText);
        } catch (err) {
            console.error('AIレビュー生成エラー', err);
            setError('文章の生成に失敗しました。もう一度お試しいただくか、下のボタンから直接Googleマップへお進みください。');
        } finally {
            setIsGenerating(false);
        }
    };

    // 4. AIを使わずに直接Googleへ飛ぶ処理（ダッシュボードにも記録）
    const handleDirectGoogleRedirect = async () => {
        try {
            if (lotteryResultId) {
                await trackGoogleRedirect(lotteryResultId);
            }
        } catch (err) {
            console.error('リダイレクト記録エラー', err);
        } finally {
            const url = shop?.google_review_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop?.shop_name || 'お店')}`;
            window.location.href = url;
        }
    };

    // 5. AI生成後にコピーしてGoogleへ飛ぶ処理（ダッシュボードにも記録）
    const handleGoogleRedirectWithCopy = async () => {
        try {
            if (lotteryResultId) {
                await trackGoogleRedirect(lotteryResultId);
            }
        } catch (err) {
            console.error('リダイレクト記録エラー', err);
        }
        
        if (generatedReview) {
            try {
                await navigator.clipboard.writeText(generatedReview);
                alert('口コミの文章をコピーしました！\nGoogleマップが開いたら、そのまま貼り付けて投稿してください✨');
            } catch (err) {
                console.error('コピー失敗', err);
            }
        }
        
        const url = shop?.google_review_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop?.shop_name || 'お店')}`;
        window.location.href = url;
    };

    if (isLoadingShop) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 animate-pulse">お店のデータを読み込み中...</div>;

    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-2xl mt-6 sm:mt-10 font-sans pb-20">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
                {shop?.shop_name}
            </h2>
            {/* ★規約違反にならない自然な文言に変更 */}
            <p className="text-sm text-gray-500 text-center mb-6 border-b pb-4">
                サービス向上のため、アンケートにご協力をお願いいたします。
            </p>

            {error && <div className="p-4 mb-4 bg-red-50 text-red-600 font-bold rounded-xl text-sm">{error}</div>}

            {/* AIが生成した口コミがまだ無い場合 */}
            {!generatedReview ? (
                <div>
                    <p className="text-gray-700 font-bold mb-4 text-center">
                        評価したい項目<span className="text-red-500">だけ</span>星をつけてください🌟
                    </p>

                    {/* ★追加：担当者名の入力フォーム */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <label className="block text-gray-700 font-bold text-sm sm:text-base mb-2">
                            担当スタッフ名（任意）
                        </label>
                        <input
                            type="text"
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                            placeholder=""
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            ※名前を入力すると、より自然で人間味のある口コミが作成されます。
                        </p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                        {reviewElements.map((element) => (
                            <div key={element} className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-700 text-sm sm:text-base">
                                        {element}
                                    </span>
                                    {(ratings[element] || 0) > 0 && (
                                        <button
                                            onClick={() => handleClear(element)}
                                            className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                        >
                                            ✕ クリア
                                        </button>
                                    )}
                                </div>
                                <div className="flex space-x-2 justify-center sm:justify-start">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleStarClick(element, star)}
                                            className={`text-3xl sm:text-4xl transition-all transform ${
                                                (ratings[element] || 0) >= star 
                                                    ? 'text-yellow-400 scale-110 drop-shadow-md' 
                                                    : 'text-gray-300 hover:text-yellow-200'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating}
                        className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all text-lg active:scale-95 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                AIが口コミを作成中...🤖✨
                            </span>
                        ) : (
                            'AIに口コミを書いてもらう ✨'
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3 mb-6">
                        AIが自然な文章を作成します。自分で考える必要はありません！
                    </p>

                    <div className="border-t border-gray-200 pt-6">
                        <button
                            onClick={handleDirectGoogleRedirect}
                            className="w-full bg-white text-gray-600 font-bold py-4 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm shadow-sm"
                        >
                            AIを使わず、自分でGoogleマップに書く ✍️
                        </button>
                    </div>
                </div>
            ) : (
                /* AIが口コミを作った後の画面 */
                <div className="animate-fade-in-up">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl mb-6 relative">
                        <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                            AI作成完了！
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            {generatedReview}
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleRedirectWithCopy}
                        className="w-full bg-red-500 text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95 text-lg flex items-center justify-center mb-4"
                    >
                        <span className="mr-2">📋</span> 文章をコピーしてGoogleへ
                    </button>
                    
                    <p className="text-xs text-center text-gray-500 mb-6 font-bold">
                        ※Googleマップが開いたら、星を選んで文章を「貼り付け」してください。
                    </p>

                    {/* ★追加: AI再生成と直接遷移のボタンエリア */}
                    <div className="border-t border-gray-200 pt-6 space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={isGenerating}
                            className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all text-sm flex items-center justify-center"
                        >
                            {isGenerating ? (
                                <span className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    考え直し中...
                                </span>
                            ) : (
                                '🔄 もう一度AIに作り直してもらう'
                            )}
                        </button>
                        
                        <button
                            onClick={handleDirectGoogleRedirect}
                            className="w-full bg-white text-gray-600 font-bold py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all text-sm shadow-sm"
                        >
                            やっぱり自分で書く（直接Google口コミ画面へ） ✍️
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;