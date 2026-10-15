import React, { useState } from 'react';
import Omikuji from './pages/Omikuji';
import ReviewForm from './pages/ReviewForm';

function App() {
  // 今どの画面を表示しているかを記憶するメモ帳（最初は 'omikuji'）
  const [currentScreen, setCurrentScreen] = useState<'omikuji' | 'review'>('omikuji');

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* メモ帳の中身が 'omikuji' ならおみくじ画面を出す */}
      {currentScreen === 'omikuji' && (
        <Omikuji onNext={() => setCurrentScreen('review')} />
      )}

      {/* メモ帳の中身が 'review' に変わったら口コミ画面を出す */}
      {currentScreen === 'review' && (
        <ReviewForm />
      )}
    </div>
  );
}

export default App;