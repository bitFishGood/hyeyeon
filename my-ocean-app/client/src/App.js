import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import BitFish from './components/BitFish';
import Login from './components/Login';
import Signup from './components/Signup';
// 기존 Aquarium 대신, "내 어항" 페이지는 OceanView로 처리합니다.
import OceanView from './pages/OceanView';
import MiniGame from './components/MiniGame';
import Archive from './components/Archive';
import DecorateView from './pages/DecorateView';
import FriendOcean from './pages/FriendOcean';
import KakaoCallback from './components/Auth/KakaoCallback';
// import FishPosts from './components/FishPosts';

import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  // 토큰을 localStorage에서 읽어오되, 없으면 빈 문자열
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // 토큰이 있고 아직 사용자 정보가 없는 경우, API 호출을 통해 사용자 정보를 가져옵니다.
    if (token && !user) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
        .then(data => setUser(data))
        .catch(err => {
          console.error('Failed to fetch user info:', err);
          localStorage.removeItem('token');
          setToken('');
          navigate('/login');
        });
    }
  }, [token, user, navigate]);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  return (
    <div className="app">
      <Routes>
        {/* 기본 경로와 /index 경로는 BitFish 웰컴페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/bitfish" replace />} />
        <Route path="/index" element={<Navigate to="/bitfish" replace />} />

        <Route path="/bitfish" element={<BitFish />} />
        <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
        <Route path="/signup" element={<Signup onSignup={handleLoginSuccess} />} />
        <Route path="/friend" element={<FriendOcean />} />

        {/*
          기존 내 어항(Aquarium) 컴포넌트 대신, OceanView.jsx를 사용합니다.
          /aquarium 경로로 접근하면 현재 user.username(없으면 "younk")로
          /ocean/:username 경로로 리다이렉트하도록 구현합니다.
        */}
        <Route
          path="/aquarium"
          element={
            <Navigate
              to={`/ocean/${user ? user.username : 'younk'}`}
              replace
            />
          }
        />
        {/* OceanView 페이지는 /ocean/:username 경로에 연결 */}
        <Route path="/ocean/:username" element={<OceanView />} />

        <Route path="/minigame" element={<MiniGame token={token} />} />
        <Route path="/archive" element={<Archive token={token} />} />
        <Route path="/decorate/:username" element={<DecorateView />} />
        {/*
          FishPosts 컴포넌트를 사용하려면, 아래 주석 해제 및 파일 존재 확인
          <Route path="/fishposts" element={<FishPosts />} />
        */}
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
      </Routes>
    </div>
  );
}
