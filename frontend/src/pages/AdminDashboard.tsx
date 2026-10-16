import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchShopAnalytics } from '../api/shopApi';

const AdminDashboard = () => {
    const { shopId } = useParams<{ shopId: string }>();
    
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchShopAnalytics(Number(shopId));
                setData(res);
            } catch (err) {
                console.error('統計データの取得に失敗しました', err);
                setError('データの取得に失敗しました。');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [shopId]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 animate-pulse">データを集計中...</div>;
    if (error) return <div className="text-center p-10 font-bold text-red-500">{error}</div>;
    if (!data) return null;

    const { shop_name, stats, lottery_ratios } = data;

    // グラフ下の凡例をカスタム（スマホ対応）
    // 大吉 50% のように％も並べて、重ならない安全な位置に配置します
    const renderCustomLegend = (value: string, entry: any) => {
        const { payload } = entry;
        const total = stats.total_draws;
        const percentage = total > 0 ? ((payload.value / total) * 100).toFixed(0) : '0';
        return (
            <span className="text-xs sm:text-sm font-bold text-gray-700 mr-2 inline-flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
                {value} ({percentage}%)
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 bg-gray-50 min-h-screen font-sans">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-6 border-b-4 border-blue-500 inline-block pb-2 pr-4 sm:pr-8">
                📊 {shop_name} - 統計
            </h2>

            {/* KPIカード群：スマホは1列、タブレット以上は3列 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border-l-4 sm:border-l-8 border-blue-500">
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">🎟️ おみくじ総数</p>
                    <p className="text-3xl sm:text-5xl font-black text-gray-800">
                        {stats.total_draws} <span className="text-sm sm:text-xl font-bold text-gray-400">回</span>
                    </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border-l-4 sm:border-l-8 border-green-500">
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">🚀 口コミ遷移数</p>
                    <p className="text-3xl sm:text-5xl font-black text-gray-800">
                        {stats.redirected_count} <span className="text-sm sm:text-xl font-bold text-gray-400">人</span>
                    </p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border-l-4 sm:border-l-8 border-purple-500 relative overflow-hidden">
                    <p className="text-xs sm:text-sm font-bold text-gray-500 mb-1">🔥 口コミ遷移率</p>
                    <p className="text-3xl sm:text-5xl font-black text-purple-600 relative z-10">
                        {stats.conversion_rate} <span className="text-sm sm:text-xl font-bold text-purple-400">％</span>
                    </p>
                    <div className="absolute -bottom-2 -right-2 text-5xl sm:text-7xl opacity-5 z-0">📈</div>
                </div>
            </div>

            {/* グラフエリア */}
            <div className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-sm">
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 sm:mb-6 text-center">🎯 おみくじ結果の割合</h3>
                
                {stats.total_draws === 0 ? (
                    <p className="text-center text-gray-400 py-12 sm:py-20 font-bold bg-gray-50 rounded-xl">まだおみくじが引かれていません。</p>
                ) : (
                    // スマホでつぶれないように高さは280px以下に下がらないように確保
                    <div className="h-72 sm:h-80 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                                <Pie
                                    data={lottery_ratios}
                                    cx="50%"
                                    cy="45%" // 凡例を押し込まないように少し上に配置
                                    innerRadius={55} // 小さい画面でも収まるように少し内径・外径を調整
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                    animationDuration={1200}
                                    // ★ labelの出力を廃止！画面をすっきりさせ、重なりを解決します
                                >
                                    {lottery_ratios.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => [`${value}回`, '出現回数']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                                />
                                {/* 改良したレスポンシブ用の凡例（Legend） */}
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={40} 
                                    formatter={renderCustomLegend}
                                    iconType="none" // カスタムで丸を描くため非表示に
                                    wrapperStyle={{ 
                                        paddingTop: '10px', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        flexWrap: 'wrap', 
                                        gap: '4px' 
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* ドーナツの真ん中にある「総計」のバッジも一回り小さく調整して、窮屈さを解消 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ transform: 'translateY(-10px)' }}>
                            <span className="text-gray-400 font-bold text-xs">総計</span>
                            <span className="text-2xl sm:text-3xl font-black text-gray-700">{stats.total_draws}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;