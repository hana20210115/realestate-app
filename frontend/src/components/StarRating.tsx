import React from 'react';

// 親から受け取るルールの契約書を更新
type StarRatingProps = {
    elementId: number;
    currentScore: number; // 親のメモ帳に書かれている「今の点数」
    onChange: (elementId: number, score: number) => void; // 親から渡された「書き込み用のペン」
};

const StarRating = ({ elementId, currentScore, onChange }: StarRatingProps) => {
    // ※子ども自身のメモ帳（useState）は親に渡したので削除しました

    return (
        <div className="flex space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    // クリックされたら、親のペン（onChange）を使って親のメモ帳に点数を書き込む
                    onClick={() => onChange(elementId, star)}
                    className={`text-4xl transition-colors duration-200 ${
                        star <= currentScore ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;