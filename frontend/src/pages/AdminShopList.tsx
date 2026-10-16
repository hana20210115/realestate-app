import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllShops } from '../api/shopApi';

const AdminShopList = () => {
    const [shops, setShops] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadShops = async () => {
            try {
                const data = await fetchAllShops();
                setShops(data);
            } catch (error) {
                console.error("店舗一覧の取得に失敗しました", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadShops();
    }, []);

    if (isLoading) return <div className="text-center p-10 font-bold text-gray-500 animate-pulse">読み込み中...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen font-sans">
            <h2 className="text-3xl font-black text-gray-800 mb-8 border-b-4 border-gray-800 inline-block pb-2">
                🏢 全店舗 管理ポータル
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                    <div key={shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                                    ID: {shop.id}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 truncate">
                                {shop.shop_name}
                            </h3>
                            
                            <div className="flex space-x-3">
                                {/* ダッシュボードへのリンクボタン */}
                                <Link 
                                    to={`/admin/shops/${shop.id}/analytics`}
                                    className="flex-1 bg-blue-50 text-blue-600 font-bold text-center py-3 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    📊 統計データ
                                </Link>
                                
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminShopList;