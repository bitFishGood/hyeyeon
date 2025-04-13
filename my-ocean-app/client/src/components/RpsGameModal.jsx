import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './RpsGameModal.css';

const choices = [
  { name: '가위', img: '/assets/scissors.png' },
  { name: '바위', img: '/assets/rock.png' },
  { name: '보', img: '/assets/paper.png' },
];

function getResult(player, computer) {
  if (player === computer) return '무승부';
  if (
    (player === '가위' && computer === '보') ||
    (player === '바위' && computer === '가위') ||
    (player === '보' && computer === '바위')
  ) return '승리';
  return '패배';
}

export default function RpsGameModal({ token, onClose, onReward }) {
  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState('');
  const [playerChoice, setPlayerChoice] = useState(null);
  const [enemyChoice, setEnemyChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice) => {
    const random = choices[Math.floor(Math.random() * 3)];
    const res = getResult(choice.name, random.name);

    setPlayerChoice(choice);
    setEnemyChoice(random);
    setResult(res);
    setShowResult(true);

    if (res === '승리') setWins(w => w + 1);
    else if (res === '패배') setGameOver(true);
  };

  const nextRound = () => {
    if (round >= 7) {
      handleReward();
      return;
    }
    setRound(r => r + 1);
    setPlayerChoice(null);
    setEnemyChoice(null);
    setResult('');
    setShowResult(false);
  };

  const handleReward = () => {
    let grade = 'C';
    if (wins >= 4 && wins < 7) grade = 'B';
    if (wins === 7) grade = 'A';

    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: `${grade}등급 상자` })
    })
      .then(() => {
        alert(`${grade}등급 상자를 획득했습니다!`);
        onReward && onReward(`${grade}등급 상자`);
        onClose();
      })
      .catch(err => {
        console.error('Reward error:', err);
        onClose();
      });
  };

  return (
    <div className="rps-overlay">
      <div className="rps-modal">
        {!gameOver && !showResult && (
          <>
            <h2>{round}번째 판</h2>
            <p>가위, 바위, 보 중 하나를 선택하세요!</p>
            <div className="rps-choice-list">
              {choices.map(choice => (
                <motion.button
                  key={choice.name}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoice(choice)}
                  className="rps-choice"
                >
                  <img src={choice.img} alt={choice.name} />
                  <p>{choice.name}</p>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {showResult && !gameOver && (
          <div className="rps-result">
            <h3>당신: {playerChoice?.name} / 상대: {enemyChoice?.name}</h3>
            <h2>{result}</h2>
            <div className="rps-buttons">
              <button onClick={nextRound}>계속</button>
              <button onClick={() => setGameOver(true)}>포기</button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="rps-result">
            <h2>게임 종료</h2>
            <p>총 승리 수: {wins}</p>
            <button onClick={handleReward}>보상 받기</button>
          </div>
        )}
        <button className="rps-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
