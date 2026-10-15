import React, { useState } from 'react';

// ① 親から受け取るデータ（Props）のルール決め
type StarRatingProps = {
    elementId: number;
};

// ② 星評価コンポーネント本体
const StarRating = ({ elementId }: StarRatingProps) => {
    // ③ 何個の星が押されたかを記憶するメモ帳（State）
    const [rating, setRating] = useState(0);

    return (
        <div className="flex space-x-2 mt-2">
            {/* 1から5までの数字をループさせて、星を5つ作る */}
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-colors duration-200 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;