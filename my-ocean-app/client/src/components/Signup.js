// src/components/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'; // 아래 Signup.css를 import

export default function Signup({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          onSignup(data.token, data.user);
          navigate('/aquarium');
        } else {
          alert('회원가입 실패: ' + (data.message || '알 수 없는 오류'));
        }
      })
      .catch(err => {
        console.error('Signup error:', err);
        alert('회원가입 실패: 서버 오류');
      });
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <label htmlFor="name">이름</label>
            <input
              type="text" id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">이메일</label>
            <input
              type="email" id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password" id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-confirm">
            회원가입
          </button>
        </form>
        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
