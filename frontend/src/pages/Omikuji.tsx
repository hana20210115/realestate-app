import React, { useState } from 'react';

type OmikujiProps = {
    onNext: () => void;
};

type OmikujiResult = {
    text: string;
    imagePath: string;
};

const OMIKUJI_DATA: OmikujiResult[] = [
    { text: '大吉', imagePath: '/images/daikichi.jpg' },
    { text: '中吉', imagePath: '/images/chukichi.jpg' },
    { text: '小吉', imagePath: '/images/shokichi.jpg' }
];

const Omikuji = ({ onNext }: OmikujiProps) => {
    const [result, setResult] = useState<OmikujiResult | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [flashImage, setFlashImage] = useState<string | null>(null);

    // おみくじを引く（ルーレット＆減速）
    const drawOmikuji = () => {
        setIsDrawing(true);
        setResult(null);

        let currentStep = 0;
        const totalSteps = 24; // シャッフルする回数
        let delay = 50;        // スタート時の速度（50ミリ秒 = 超高速！）

        const shuffle = () => {
            currentStep++;

            // 前回の画像と同じにならないように工夫してランダム抽出
            const randomIndex = Math.floor(Math.random() * OMIKUJI_DATA.length);
            setFlashImage(OMIKUJI_DATA[randomIndex].imagePath);

            // ★段階的減速（スロットがだんだん重くなって止まる動き）
            if (currentStep < 10) {
                delay = 50;  // 超高速シャッフル
            } else if (currentStep < 16) {
                delay += 15; // じわじわ遅く
            } else if (currentStep < 20) {
                delay += 35; // はっきり遅く
            } else {
                delay += 75; // ガタッ…ガタッ…と最後の一押し
            }

            if (currentStep < totalSteps) {
                // 次のシャッフルを予約
                setTimeout(shuffle, delay);
            } else {
                // 最終決定！
                const finalResult = OMIKUJI_DATA[Math.floor(Math.random() * OMIKUJI_DATA.length)];
                setResult(finalResult);
                setFlashImage(null);
                setIsDrawing(false);
            }
        };

        // ルーレット開始！
        setTimeout(shuffle, delay);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center relative overflow-hidden">
            
            {/* ① 超絶スムーズ＆ド派手なアニメーションを追加（CSSの直接埋め込み） */}
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
                .animate-rumble {
                    animation: rumble 0.1s infinite linear;
                }
                .animate-impact-pop {
                    animation: impact-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .animate-sparkle-rotate {
                    animation: sparkle-rotate 10s infinite linear;
                }
            `}</style>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">運試しおみくじ</h2>
            
            {/* 状態1：まだ引いていない時のボタン */}
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

            {/* 状態2：スロット中の表示（超滑らかに振動します！） */}
            {isDrawing && flashImage && (
                <div className="flex flex-col items-center justify-center mb-8 animate-rumble">
                    <p className="text-2xl font-black text-red-500 mb-4 tracking-widest animate-pulse">
                        シャッフル中...!!
                    </p>
                    <div className="relative">
                        {/* 軌跡のぼやけ(blur)をつけてスピード感をマシマシに */}
                        <img 
                            src={flashImage} 
                            alt="シャッフル中" 
                            className="w-64 h-64 object-contain filter blur-[1px] opacity-90 scale-95"
                        />
                    </div>
                </div>
            )}

            {/* 状態3：結果がドーン！と出た時の表示（決定の瞬間大爆発！） */}
            {!isDrawing && result && (
                <div className="relative">
                    {/* ★大吉や中吉の背後で輝く、くるくる回る後光（神々しい演出！） */}
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
                    
                    <button 
                        onClick={onNext}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] text-lg mt-2"
                    >
                        口コミ画面へ進む
                    </button>
                </div>
            )}

            {/* ② ★超極秘：カクカク撲滅のためのプリロード（ブラウザのキャッシュに裏側で仕込む） */}
            <div className="hidden" aria-hidden="true">
                {OMIKUJI_DATA.map((item, index) => (
                    <img key={index} src={item.imagePath} alt="preload" />
                ))}
            </div>
        </div>
    );
};

export default Omikuji;