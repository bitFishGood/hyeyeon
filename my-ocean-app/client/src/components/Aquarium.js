import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Mailbox from './Mailbox';
import HelpModal from './HelpModal';
import ShareModal from './ShareModal';
import SettingsModal from './SettingsModal';
import { useNavigate } from 'react-router-dom';

export default function Aquarium({ user, token }) {
  const [bgIndex, setBgIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [fishPaused, setFishPaused] = useState(false);
  const [modal, setModal] = useState('');
  const [letters, setLetters] = useState([]);
  const [placedItems, setPlacedItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch letters and items from server on load
    if (token) {
      fetch('/api/letters', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            setLetters(data);
          }
        })
        .catch(err => console.error('Failed to fetch letters:', err));

      fetch('/api/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.placed) {
            setPlacedItems(data.placed);
          }
        })
        .catch(err => console.error('Failed to fetch items:', err));
    }
  }, [token]);

  const moveLeft = () => {
    if (bgIndex > 0) setBgIndex(bgIndex - 1);
  };

  const moveRight = () => {
    if (bgIndex < 3) setBgIndex(bgIndex + 1);
  };

  const captureScreen = () => {
    const appElement = document.querySelector('.app');
    if (!appElement) return;
    html2canvas(appElement).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'my_ocean_capture.png';
      link.click();
    });
    const sound = document.getElementById('captureSound');
    if (sound) sound.play();
  };

  const handleLogout = () => {
    // Clear token and user, navigate to login
    localStorage.removeItem('token');
    setModal('');
    navigate('/login');
    window.location.reload();
  };

  // Item placement in UI: decide random positions for placed items
  const getItemStyle = () => {
    // Random position within aquarium bounds
    const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
    const left = Math.floor(Math.random() * 80) + 10;
    return {
      position: 'absolute',
      top: top + '%',
      left: left + '%',
      fontSize: '24px'
    };
  };

  return (
    <div className="app">
      {/* Background images sliding */}
      <div className="background-wrap" style={{ transform: `translateX(-${bgIndex * 25}%)` }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="background" style={{ backgroundImage: "url('background.png')" }}></div>
        ))}
      </div>

      {/* Fish swimming */}
      <div className="fish-container" style={{ animationPlayState: fishPaused ? 'paused' : 'running' }}>
        <img src="fish1.png" alt="물고기1" className="fish fish1" />
        <img src="fish2.png" alt="물고기2" className="fish fish2" />
        <img src="fish3.png" alt="물고기3" className="fish fish3" />
      </div>

      {/* Placed items in aquarium (e.g., shells) */}
      {placedItems.map(item => (
        <div key={item._id} style={getItemStyle()} onClick={() => alert('아이템을 제거하려면 보관함에서 삭제하세요.')}>
          🐚
        </div>
      ))}

      {/* Left menu icons */}
      <div className="left-menu">
        <button className="menu-btn" onClick={() => setModal('help')}>📜</button>
        <button className="menu-btn" onClick={() => setModal('message')}>💌</button>
        <button className="menu-btn" onClick={() => setModal('setting')}>⚙️</button>
        <button className="menu-btn" onClick={() => setModal('copy')}>🔗</button>

      </div>

      {/* Arrows to move background */}
      <button className="arrow arrow-left" onClick={moveLeft}>⬅</button>
      <button className="arrow arrow-right" onClick={moveRight}>➡</button>

      {/* Bottom buttons (screenshot and maybe reserved for future use) */}
      <div className="bottom-btns">
        <button className="circle-btn" onClick={captureScreen}>📷</button>
        <button className="circle-btn" onClick={() => alert('아이템이 모두 제거되었습니다.')}>🗑️</button>
      </div>

      {/* Modals */}
      {modal && (
        <div className="modal" onClick={() => setModal('')}>
          {modal === 'help' && <HelpModal closeModal={() => setModal('')} />}
          {modal === 'message' && <Mailbox letters={letters} token={token} setLetters={setLetters} closeModal={() => setModal('')} />}
          {modal === 'setting' && <SettingsModal
                                      musicPlaying={musicPlaying} toggleMusic={() => {
                                        setMusicPlaying(!musicPlaying);
                                        alert(musicPlaying ? '음악이 정지됩니다.' : '음악이 재생됩니다.');
                                      }}
                                      fishPaused={fishPaused} toggleFish={() => {
                                        setFishPaused(!fishPaused);
                                        alert(fishPaused ? '물고기 애니메이션이 재생됩니다.' : '물고기 애니메이션이 정지됩니다.');
                                      }}
                                      onLogout={handleLogout}
                                      closeModal={() => setModal('')} />}
          {modal === 'copy' && <ShareModal closeModal={() => setModal('')} />}
        </div>
      )}

      {/* Audio for capture sound */}
      <audio id="captureSound" src="capture.mp3"></audio>
    </div>
  );
}
