import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import RpsGameModal from '../components/RpsGameModal';

const cssString = `
/* (기존 스타일 생략, 필요시 삽입) */
body { margin: 0; padding: 0; font-family: sans-serif; }
/* 추가 스타일은 실제 프로젝트에 작성 */
`;

function useInjectStyle(text) {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = text;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [text]);
}

export default function FriendOceanOneFile({ token }) {
  useInjectStyle(cssString);

  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [modal, setModal] = useState("");
  const [inventory, setInventory] = useState(["Shell", "Treasure"]);
  const [placedItems, setPlacedItems] = useState([]);
  const [showRpsGame, setShowRpsGame] = useState(false);
  const [message, setMessage] = useState("");

  function moveLeft() {
    if (bgIndex > 0) setBgIndex(bgIndex - 1);
  }
  function moveRight() {
    if (bgIndex < 3) setBgIndex(bgIndex + 1);
  }

  function captureScreen() {
    const appEl = document.querySelector(".app");
    if (!appEl) return;
    html2canvas(appEl).then(canvas => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "my_ocean_capture.png";
      link.click();
    });
  }

  function handleTrash() {
    if (!window.confirm("모든 아이템을 제거할까요?")) return;
    setPlacedItems([]);
    alert("아이템이 모두 제거되었습니다.");
  }

  function handleGameReward(newItem) {
    setInventory(prev => [...prev, newItem]);
  }

  function handleExit() {
    if (window.confirm("정말 나가시겠습니까?")) {
      navigate("/");
    }
  }

  function sendMessageToFriend() {
    if (!message) {
      alert("메시지를 입력해주세요!");
      return;
    }
    alert(`메시지 전송: ${message}`);
    setMessage("");
    setModal("");
  }

  return (
    <div className="app">
      <div
        className="background-wrap"
        style={{ transform: `translateX(-${bgIndex * 25}%)` }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="background"
            style={{ backgroundImage: "url('/background.png')" }}
          />
        ))}
      </div>

      <div className="fish-container">
        {placedItems.map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${20 + i * 10}%`,
              left: `${10 + i * 8}%`
            }}
          >
            🐚
          </div>
        ))}
      </div>

      <div className="left-menu">
        <button className="menu-btn" onClick={() => setModal("help")}>❓</button>
        <button className="menu-btn" onClick={() => setModal("message")}>💬</button>
        <button className="menu-btn" onClick={() => setShowRpsGame(true)}>✊</button>
        <button className="menu-btn" onClick={() => setModal("inventory")}>🎁</button>
        <button className="menu-btn" onClick={handleExit}>🚪</button>
      </div>

      <button className="arrow arrow-left" onClick={moveLeft}>⬅</button>
      <button className="arrow arrow-right" onClick={moveRight}>➡</button>

      <div className="bottom-btns">
        <button className="circle-btn" onClick={captureScreen}>📷</button>
        <button className="circle-btn" onClick={handleTrash}>🗑️</button>
      </div>

      {modal && (
        <div className="modal" onClick={() => setModal("")}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {modal === "help" && (
              <>
                <h2>사용설명</h2>
                <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                  <li>아이템을 배치해 어항 꾸미기</li>
                  <li>미니게임으로 추가 아이템 획득</li>
                  <li>친구에게 메시지 남기기 가능</li>
                </ul>
              </>
            )}
            {modal === "message" && (
              <>
                <h2>메시지 남기기</h2>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ width: "100%", height: "80px", marginTop: "10px" }}
                  placeholder="메시지를 입력하세요"
                />
                <button onClick={sendMessageToFriend} style={{ marginTop: "10px" }}>
                  보내기
                </button>
              </>
            )}
            {modal === "inventory" && (
              <>
                <h2>아이템 보관함</h2>
                {inventory.length === 0 ? (
                  <p>아이템 없음</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {inventory.map((it, idx) => (
                      <li key={idx} style={{ margin: "5px 0" }}>
                        {it}
                        <button
                          onClick={() => setPlacedItems(prev => [...prev, it])}
                          style={{ marginLeft: "6px" }}
                        >
                          배치
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            <button onClick={() => setModal("")} style={{ marginTop: "10px" }}>
              닫기
            </button>
          </div>
        </div>
      )}

      {showRpsGame && (
        <RpsGameModal
          token={token}
          onClose={() => setShowRpsGame(false)}
          onReward={handleGameReward}
        />
      )}
    </div>
  );
}
