import React from 'react';
// URLを管理するための部品をインポート
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Omikuji from './pages/Omikuji';
import ReviewForm from './pages/ReviewForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-10">
        <Routes>
          {/* ① QRコードからアクセスされるおみくじ画面（:shopId に店舗の番号が入ります） */}
          <Route path="/shops/:shopId/omikuji" element={<Omikuji />} />
          
          {/* ② おみくじ後に遷移する口コミ画面 */}
          <Route path="/shops/:shopId/review" element={<ReviewForm />} />
          
          {/* ③ 万が一間違ったURLにアクセスされたら、とりあえず1番店舗のおみくじに飛ばす（開発用） */}
          <Route path="*" element={<Navigate to="/shops/1/omikuji" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;