import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveLotteryResult } from '../api/shopApi';

type OmikujiResult = {
    value: number; // DB保存用 1:大吉, 2:中吉, 3:小吉
    text: string;
    imagePath: string;
};

const OMIKUJI_DATA: OmikujiResult[] = [
    { value: 1, text: '大吉', imagePath: '/images/daikichi.jpg' },
    { value: 2, text: '中吉', imagePath: '/images/chukichi.jpg' },
    { value: 3, text: '小吉', imagePath: '/images/shokichi.jpg' },
];

const Omikuji = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();

    const [result, setResult] = useState<OmikujiResult | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [flashImage, setFlashImage] = useState<string | null>(null);
    
    // DB関連のステート
    const [lotteryResultId, setLotteryResultId] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const saveResult = async (finalResult: OmikujiResult) => {
        setIsSaving(true);
        setSaveError(null);
        try {
            const res = await saveLotteryResult({
                shop_id: Number(shopId) || 1,
                result: finalResult.value,
            });
            setLotteryResultId(res.data.id);
            setIsSaving(false);
        } catch (error) {
            console.error('おみくじ結果の保存に失敗しました', error);
            setSaveError('結果の保存に失敗しました。もう一度お試しください。');
            setIsSaving(false);
        }
    };

    const drawOmikuji = () => {
        setIsDrawing(true);
        setResult(null);
        setLotteryResultId(null);
        setSaveError(null);

        let currentStep = 0;
        const totalSteps = 24;
        let delay = 50;

        const shuffle = () => {
            currentStep++;
            const randomIndex = Math.floor(Math.random() * OMIKUJI_DATA.length);
            setFlashImage(OMIKUJI_DATA[randomIndex].imagePath);

            if (currentStep < 10) delay = 50;
            else if (currentStep < 16) delay += 15;
            else if (currentStep < 20) delay += 35;
            else delay += 75;

            if (currentStep < totalSteps) {
                setTimeout(shuffle, delay);
            } else {
                const finalResult =
                    OMIKUJI_DATA[Math.floor(Math.random() * OMIKUJI_DATA.length)];
                setResult(finalResult);
                setFlashImage(null);
                setIsDrawing(false);

                // 結果が出たら裏側でLaravelのDBに保存し、IDを受け取る
                void saveResult(finalResult);
            }
        };

        setTimeout(shuffle, delay);
    };

    return (
        <div translate="no" className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center relative overflow-hidden">
            <style>{`
                @keyframes rumble {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    15% { transform: translate(-3px, 2px) rotate(-1.5deg); }
                    30% { transform: translate(3px, -1px) rotate(1.5deg); }
                    45% { transform: translate(-1px, -3px) rotate(-1.5deg); }
                    60% { transform: translate(3px, 2px) rotate(1.5deg); }
                    75% { transform: translate(-2px, -1px) rotate(-0.5deg); }
                    90% { transform: translate(1px, 3px) rotate(0.5deg); }
                }
                @keyframes impact-pop {
                    0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
                    50% { transform: scale(1.3) rotate(5deg); filter: brightness(1.2); }
                    70% { transform: scale(0.9) rotate(-2deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes sparkle-rotate {
                    0% { transform: rotate(0deg) scale(0.9); opacity: 0.2; }
                    50% { transform: rotate(180deg) scale(1.1); opacity: 0.7; }
                    100% { transform: rotate(360deg) scale(0.9); opacity: 0.2; }
                }
                .animate-rumble { animation: rumble 0.1s infinite linear; }
                .animate-impact-pop { animation: impact-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-sparkle-rotate { animation: sparkle-rotate 10s infinite linear; }
            `}</style>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">運試しおみくじ</h2>

            {!isDrawing && !result && (
                <div className="py-12">
                    <button
                        onClick={drawOmikuji}
                        className="bg-red-500 text-white font-bold py-5 px-12 rounded-full shadow-lg hover:bg-red-600 transition-all text-2xl hover:scale-105 active:scale-95 animate-bounce"
                    >
                        おみくじを引く！
                    </button>
                </div>
            )}

            {isDrawing && flashImage && (
                <div className="flex flex-col items-center justify-center mb-8 animate-rumble">
                    <p className="text-2xl font-black text-red-500 mb-4 tracking-widest animate-pulse">
                        シャッフル中...!!
                    </p>
                    <div className="relative">
                        <img
                            src={flashImage}
                            alt="シャッフル中"
                            className="w-64 h-64 object-contain filter blur-[1px] opacity-90 scale-95"
                        />
                    </div>
                </div>
            )}

            {!isDrawing && result && (
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center -z-10 animate-sparkle-rotate">
                        <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-red-500 blur-2xl opacity-40"></div>
                    </div>
                    <p className="text-xl text-gray-600 mb-4 animate-bounce font-bold">結果は...</p>
                    <div className="flex flex-col items-center justify-center mb-8 animate-impact-pop">
                        <img
                            src={result.imagePath}
                            alt={result.text}
                            className="w-72 h-72 object-contain rounded-lg shadow-2xl border-4 border-yellow-400 transform"
                        />
                        <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-full px-6 py-1.5 shadow-sm">
                            <span className="text-2xl font-black text-yellow-600 tracking-wider">
                                ✨ おめでとうございます！ ✨
                            </span>
                        </div>
                    </div>

                    {saveError && (
                        <div className="mb-3">
                            <p className="text-sm text-red-600 mb-2">{saveError}</p>
                            <button
                                onClick={() => void saveResult(result)}
                                className="text-sm text-blue-600 underline"
                            >
                                保存をやり直す
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <button
                            disabled={isSaving || !lotteryResultId}
                            onClick={() => {
                                if (lotteryResultId && !isSaving) {
                                    navigate(`/shops/${shopId}/review`, { state: { lotteryResultId } });
                                }
                            }}
                            className="bg-red-500 text-white font-extrabold py-4 px-8 rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-bounce"
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center text-base">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    結果を記録中...
                                </span>
                            ) : (
                                <span>口コミを投稿する！ </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <div className="hidden" aria-hidden="true">
                {OMIKUJI_DATA.map((item, index) => (
                    <img key={index} src={item.imagePath} alt="preload" />
                ))}
            </div>
        </div>
    );
};

export default Omikuji;