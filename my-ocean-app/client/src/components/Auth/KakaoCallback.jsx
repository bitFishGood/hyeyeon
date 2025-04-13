import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 인증 후 카카오가 넘겨준 code 파라미터 확인
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      alert('카카오 인증 코드가 없습니다.');
      return;
    }

    // 백엔드로 code 전송
    fetch('http://localhost:8080/oauth/kakao/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        // 백엔드에서 발급한 JWT 토큰이나 세션 등 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/aquarium');
          // 원하는 라우트로 이동 (예: 로그인 성공 후 메인 페이지)
        } else {
          alert('카카오 로그인 실패');
        }
      })
      .catch(err => {
        console.error('로그인 실패:', err);
        alert('카카오 로그인 에러');
      });
  }, [navigate]);

  return <p>카카오 로그인 처리 중입니다...</p>;
}

export default KakaoCallback;
