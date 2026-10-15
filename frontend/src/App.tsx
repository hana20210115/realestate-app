import React from 'react';
import ReviewForm from './pages/ReviewForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <ReviewForm />
    </div>
  );
}

// ↓ この1行が main.tsx にAppを渡すための超重要な一言（犯人）です！
export default App;