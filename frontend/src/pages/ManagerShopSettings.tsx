import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShop, updateShop } from '../api/shopApi';

const ManagerShopSettings = () => {
    const { shopId } = useParams<{ shopId: string }>();

    const [shopName, setShopName] = useState('');
    const [googleReviewUrl, setGoogleReviewUrl] = useState('');
    const [reviewElements, setReviewElements] = useState<string[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // 店舗データの読み込み
    useEffect(() => {
        const loadShop = async () => {
            try {
                const shop = await fetchShop(Number(shopId));
                setShopName(shop.shop_name || '');
                setGoogleReviewUrl(shop.google_review_url || '');
                
                const elements = Array.isArray(shop.review_elements) 
                    ? shop.review_elements.map((el: any) => typeof el === 'string' ? el : el.name)
                    : [];
                setReviewElements(elements);
            } catch (error) {
                console.error("読み込みエラー:", error);
                setMessage({ type: 'error', text: '店舗データの読み込みに失敗しました。' });
            } finally {
                setIsLoading(false);
            }
        };
        loadShop();
    }, [shopId]);

    const handleAddElement = () => {
        setReviewElements([...reviewElements, '']);
    };

    const handleChangeElement = (index: number, value: string) => {
        const newElements = [...reviewElements];
        newElements[index] = value;
        setReviewElements(newElements);
    };

    const handleRemoveElement = (index: number) => {
        const newElements = reviewElements.filter((_, i) => i !== index);
        setReviewElements(newElements);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const cleanElements = reviewElements.filter(el => el.trim() !== '');

        try {
            await updateShop(Number(shopId), {
                shop_name: shopName,
                google_review_url: googleReviewUrl,
                review_elements: cleanElements
            });
            setReviewElements(cleanElements);
            
            // ★追加：確実に気づくようにポップアップでお知らせ！
            alert('✅ 店舗の設定を保存しました！');
            
            setMessage({ type: 'success', text: '設定を保存しました！' });
            
            // 3秒後にメッセージを消す
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("保存エラー:", error);
            
            // ★追加：エラー時もポップアップで確実にお知らせ！
            alert('❌ 保存に失敗しました。通信状況などを確認してください。');
            
            setMessage({ type: 'error', text: '保存に失敗しました。' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 店長向けヘッダー（スマホ対応） */}
            <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
                <h1 className="text-lg font-bold truncate">店舗設定（{shopName}）</h1>
            </header>

            <div className="p-4 max-w-lg mx-auto mt-4">
                {message && (
                    <div className={`p-4 mb-4 rounded-xl font-bold text-sm shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <h2 className="text-md font-bold text-gray-800 mb-2">📌 お客様に評価してもらう項目</h2>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        口コミ入力画面で、お客様に星5段階で評価してもらう項目を設定します。（例：接客態度、料理の味、清潔感など）
                    </p>

                    <ul className="space-y-3 mb-4">
                        {reviewElements.map((element, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <span className="text-gray-400 font-bold text-sm">{index + 1}.</span>
                                <input 
                                    type="text" 
                                    value={element}
                                    onChange={(e) => handleChangeElement(index, e.target.value)}
                                    placeholder="例：接客態度"
                                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveElement(index)}
                                    className="p-3 text-red-400 hover:text-red-600 font-bold bg-red-50 rounded-xl"
                                    title="削除"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button 
                        type="button" 
                        onClick={handleAddElement}
                        className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm border border-blue-100 hover:bg-blue-100 transition-colors mb-6"
                    >
                        ＋ 新しい評価項目を追加する
                    </button>

                    <div className="border-t pt-6 mt-2">
                        <h2 className="text-md font-bold text-gray-800 mb-2">🔗 Google口コミ用URL</h2>
                        <input 
                            type="url" 
                            value={googleReviewUrl}
                            onChange={(e) => setGoogleReviewUrl(e.target.value)}
                            placeholder="https://g.page/r/..."
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-2">※ お客様がGoogleマップに移動する際のURLです。</p>
                    </div>
                </div>

                {/* スマホで押しやすい下部固定（または大きめ）の保存ボタン */}
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-gray-800 text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-gray-900 transition-all text-lg active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? '保存中...' : '💾 設定を保存する'}
                </button>
            </div>
        </div>
    );
};

export default ManagerShopSettings;