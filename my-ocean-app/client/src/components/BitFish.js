import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BitFish.css';

export default function BitFish() {
  const navigate = useNavigate();

  const handleStart = () => {
    // "시작하기" 버튼 클릭 시 로그인 페이지로 이동 (또는 원하는 경로)
    navigate('/login');
  };

  return (
    <div className="bitfish-wrapper">
      <div className="bitfish-container">
        <h1 className="bitfish-title">Welcome to BitFish</h1>
        <p className="bitfish-subtitle">비트피쉬에 오신 것을 환영합니다!</p>
        <button className="bitfish-start-btn" onClick={handleStart}>
          시작하기
        </button>
      </div>
    </div>
  );
}
