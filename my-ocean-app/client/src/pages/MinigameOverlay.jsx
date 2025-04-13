import React, { useState, useEffect } from "react";

export default function MinigameOverlay({ onClose, onReward }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameActive(true);
  };

  const endGame = () => {
    setGameActive(false);
    if (score >= 3) {
      // 아이템 보상
      onReward("NewItem");
      alert("축하합니다! 아이템을 획득했습니다!");
    } else {
      alert("다음 기회에...");
    }
    onClose();
  };

  const clickTarget = () => {
    if (gameActive) setScore(s => s + 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {!gameActive && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}
        >
          <h2>미니게임</h2>
          <p>10초 안에 빨간 동그라미를 많이 클릭하세요!</p>
          <button onClick={startGame}>게임 시작</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            닫기
          </button>
        </div>
      )}
      {gameActive && (
        <>
          <div
            style={{
              background: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              position: "absolute",
              top: "20px"
            }}
          >
            <div>남은 시간: {timeLeft}s</div>
            <div>점수: {score}</div>
          </div>
          <div
            onClick={clickTarget}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "red",
              position: "absolute",
              cursor: "pointer",
              top: `${Math.random() * 60 + 20}vh`,
              left: `${Math.random() * 60 + 20}vw`
            }}
          />
        </>
      )}
    </div>
  );
}

