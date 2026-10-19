import React from 'react';
// URLを管理するための部品をインポート
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Omikuji from './pages/Omikuji';
import ReviewForm from './pages/ReviewForm';
import AdminShopList from './pages/AdminShopList';
import ManagerShopSettings from "./pages/ManagerShopSettings";

// ★追加: 管理者向け画面のインポート
import AdminShopEdit from './pages/AdminShopEdit';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-10">
        <Routes>
          {/* ① QRコードからアクセスされるおみくじ画面（:shopId に店舗の番号が入ります） */}
          <Route path="/shops/:shopId/omikuji" element={<Omikuji />} />
          
          {/* ② おみくじ後に遷移する口コミ画面 */}
          <Route path="/shops/:shopId/review" element={<ReviewForm />} />
          
          {/* ★追加: 管理者用の店舗設定・評価項目編集画面 */}
          <Route path="/admin/shops/:shopId" element={<AdminShopEdit />} />
          {/* ★追加: 管理者用の店舗一覧画面 */}
          <Route path="/admin/shops" element={<AdminShopList />} />

          {/* ★追加: 管理者用の統計ダッシュボード画面 */}
          <Route path="/admin/shops/:shopId/analytics" element={<AdminDashboard />} />

          {/* ③ 万が一間違ったURLにアクセスされたら、とりあえず1番店舗のおみくじに飛ばす（開発用） */}
          <Route path="*" element={<Navigate to="/shops/1/omikuji" replace />} />

          <Route path="/manager/shops/:shopId/settings" element={<ManagerShopSettings />} /> // ★追加
        </Routes>
      </div>
    </Router>
  );
}

export default App;