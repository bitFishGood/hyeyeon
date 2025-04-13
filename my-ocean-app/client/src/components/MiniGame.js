import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MiniGame({ token }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const targetRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let moveInterval;
    let timerInterval;
    if (gameActive && timeLeft > 0) {
      // Move target every 800ms
      moveInterval = setInterval(() => {
        moveTarget();
      }, 800);
      // Countdown timer
      timerInterval = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
    if (timeLeft === 0) {
      // Game over
      clearInterval(moveInterval);
      clearInterval(timerInterval);
      // If score high enough, reward item
      if (score >= 5) {
        fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: 'Shell' })
        })
          .then(res => res.json())
          .then(data => {
            alert('축하합니다! 새로운 아이템을 획득했습니다!');
          })
          .catch(err => console.error('Item reward error:', err));
      } else {
        alert('다음 기회에...');
      }
    }
    return () => {
      clearInterval(moveInterval);
      clearInterval(timerInterval);
    };
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameActive(true);
    moveTarget();
  };

  const moveTarget = () => {
    if (targetRef.current) {
      const container = targetRef.current.parentElement;
      const maxX = container.offsetWidth - 50; // target size 50px
      const maxY = container.offsetHeight - 50;
      const newX = Math.floor(Math.random() * maxX);
      const newY = Math.floor(Math.random() * maxY);
      targetRef.current.style.left = newX + 'px';
      targetRef.current.style.top = newY + 'px';
    }
  };

  const handleClickTarget = () => {
    if (!gameActive) return;
    setScore(prev => prev + 1);
    // move target immediately on click for faster gameplay
    moveTarget();
  };

  return (
    <div className="mini-game-container" style={{ position: 'relative', width: '100%', height: '100%', background: '#eef', textAlign: 'center' }}>
      {!gameActive && (
        <div style={{ marginTop: '100px' }}>
          <h2>미니게임 시작</h2>
          <p>10초 안에 가능한 많이 클릭하세요!</p>
          <button onClick={startGame}>게임 시작</button>
        </div>
      )}
      {gameActive && timeLeft > 0 && (
        <>
          <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '18px' }}>남은 시간: {timeLeft}s</div>
          <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '18px' }}>점수: {score}</div>
          <div
            ref={targetRef}
            className="target"
            onClick={handleClickTarget}
            style={{ position: 'absolute', width: '50px', height: '50px', borderRadius: '50%', background: 'red' }}>
          </div>
        </>
      )}
      {gameActive && timeLeft === 0 && (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>게임 종료!</h2>
          <p>점수: {score}</p>
          <button onClick={() => navigate('/aquarium')}>어항으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}
