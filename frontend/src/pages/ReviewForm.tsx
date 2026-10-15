import React from 'react';
// さっき作った裏方のロジック（カスタムフック）を読み込む
import { useReviewForm } from '../hooks/useReviewForm';

const ReviewForm = () => {
    // カスタムフックを呼び出して、「評価項目のデータ」と「読み込み中状態」を受け取る
    // ※今回はテストとして「店舗ID: 1」を渡してデータを取得します
    const { reviewElements, isLoading } = useReviewForm(1);

    // データ通信中（ロード中）の画面表示
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <p className="text-center text-gray-600 font-bold mt-10">データを読み込み中...</p>
            </div>
        );
    }

    // 通信が完了した後のメイン画面表示
    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">口コミ入力</h2>

            {/* 受け取った評価項目をループ処理（foreach）で表示する */}
            <div className="mb-8">
                <ul className="space-y-4">
                    {/* reviewElementsの中身を1つずつ取り出してリストにする */}
                    {reviewElements.map((element: any) => (
                        <li key={element.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p className="font-bold text-gray-700">{element.name}</p>
                            <p className="text-sm text-gray-500 mt-2">※ここに星マークが入ります</p>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700">
                送信する
            </button>
        </div>
    );
};

export default ReviewForm;