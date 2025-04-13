import React, { useEffect } from 'react';

function KakaoLogin() {
  // 앱 키와 동일한지 꼭 확인
  const KAKAO_JAVASCRIPT_KEY = "fa003cbb07c8656757bdf385384e8987";

  useEffect(() => {
    // Kakao SDK가 로드되었는지 확인
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
      console.log("Kakao SDK init 완료!");
    }
  }, []);

  const loginWithKakao = () => {
    if (window.Kakao) {
      // Kakao API 호출
      window.Kakao.Auth.authorize({
        redirectUri: 'http://localhost:3000/oauth/kakao/callback',
        // ↑ Kakao 개발자센터 > 내 애플리케이션 > 플랫폼 > Redirect URI 에도 등록 필요
      });
    } else {
      alert("Kakao SDK 로드 실패!");
    }
  };

  return (
    <button
      onClick={loginWithKakao}
      className="login-btn"
      style={{ backgroundColor: '#FEE500', color: '#000', marginBottom: '1rem' }}
    >
      카카오톡으로 로그인
    </button>
  );
}

export default KakaoLogin;
