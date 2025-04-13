import React, { useState } from "react";
import { Link } from "react-router-dom";
import KakaoLogin from "./Auth/KakaoLogin";
import "./Login.css";

export default function Login({ onLogin }) {
  const [isMemberLogin, setIsMemberLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleMemberLogin = () => {
    alert(`회원 로그인: 이메일=${email}, 비밀번호=${password}`);
    // 실제 로그인 처리는 이곳에서 수행
    // 예) fetch('/api/login', { ... }) -> 상태 저장 -> 페이지 전환 등
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {!isMemberLogin ? (
          <>
            {/* 카카오 소셜 로그인 버튼 */}
            <KakaoLogin />

            {/* 회원 로그인 버튼 */}
            <button
              className="login-btn"
              onClick={() => setIsMemberLogin(true)}
            >
              회원으로 로그인
            </button>

            {/* 회원가입으로 이동 */}
            <div className="signup-link">
              회원이 아니신가요?{" "}
              <Link to="/signup" style={{ textDecoration: "underline" }}>
                회원가입
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="login-title">로그인</h2>
            <input
              type="text"
              placeholder="아이디를 입력하세요..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호를 입력하세요..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 로그인 버튼 */}
            <button className="btn-confirm" onClick={handleMemberLogin}>
              확인
            </button>

            {/* 뒤로 버튼 */}
            <button className="btn-back" onClick={() => setIsMemberLogin(false)}>
              뒤로
            </button>
          </>
        )}
      </div>
    </div>
  );
}
