// src/pages/OceanView.jsx
import React, { useState } from "react";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import "../App.css";

export default function OceanView() {
  const { username } = useParams();
  const [bgIndex, setBgIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [fishPaused, setFishPaused] = useState(false);
  const [modal, setModal] = useState("");

  const moveLeft = () => { if (bgIndex > 0) setBgIndex(bgIndex - 1); };
  const moveRight = () => { if (bgIndex < 3) setBgIndex(bgIndex + 1); };

  const captureScreen = () => {
    const appElement = document.querySelector(".app");
    html2canvas(appElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "my_ocean_capture.png";
      link.click();
    });
    const sound = document.getElementById("captureSound");
    if (sound) sound.play();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert("URL이 복사되었습니다!"));
  };

  return (
    <div className="app">
      <div className="background-wrap" style={{ transform: `translateX(-${bgIndex * 25}%)` }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="background" style={{ backgroundImage: "url('/background.png')" }}></div>
        ))}
      </div>

      <div className="fish-container" style={{ animationPlayState: fishPaused ? "paused" : "running" }}></div>

      <div className="left-menu">
        <button className="menu-btn" onClick={() => setModal("help")}>📜</button>
        <button className="menu-btn" onClick={() => setModal("message")}>💬</button>
        <button className="menu-btn" onClick={() => setModal("setting")}>⚙️</button>
        <button className="menu-btn" onClick={() => setModal("copy")}>🔗</button>
        <button className="menu-btn" onClick={() => window.location.href = "/"}>⬅️</button>
      </div>

      <button className="arrow arrow-left" onClick={moveLeft}>⬅</button>
      <button className="arrow arrow-right" onClick={moveRight}>➡</button>

      <div className="bottom-btns">
        <button className="circle-btn" onClick={captureScreen}>📷</button>
        <button className="circle-btn" onClick={() => alert("편지가 삭제되었습니다.")}>🗑️</button>
      </div>

      {modal && (
        <div className="modal" onClick={() => setModal("")}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal === "help" && (
              <>
                <div className="cute-icon">😊</div>
                <h2>사용설명서</h2>
                <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                  <li>쓰레기통으로 아이템 제거 가능</li>
                  <li>물고기 클릭 시 편지 보기</li>
                  <li>답신 가능</li>
                  <li>URL 공유 가능</li>
                </ul>
              </>
            )}
            {modal === "message" && (
              <>
                <div className="cute-icon">📩</div>
                <h2>편지함</h2>
                <p>현재 편지가 없습니다.</p>
              </>
            )}
            {modal === "setting" && (
              <>
                <div className="cute-icon">🎛️</div>
                <h2>설정</h2>
                <div className="setting-options">
                  <div className="setting-option" onClick={() => {
                    setMusicPlaying(!musicPlaying);
                    alert(musicPlaying ? '음악이 정지됩니다.' : '음악이 재생됩니다.');
                  }}>🔇</div>
                  <div className="setting-option" onClick={() => {
                    setFishPaused(!fishPaused);
                    alert(fishPaused ? '물고기 애니메이션이 정지되었습니다.' : '물고기 애니메이션이 재생됩니다.');
                  }}>⏸️</div>
                </div>
              </>
            )}
            {modal === "copy" && (
              <>
                <div className="cute-icon">🔗</div>
                <h2>URL 복사</h2>
                <div className="url-box">
                  <span>{window.location.href}</span>
                  <button onClick={copyUrl}>복사</button>
                </div>
              </>
            )}
            <button onClick={() => setModal("")}>닫기</button>
          </div>
        </div>
      )}

      <audio id="captureSound" src="capture.mp3"></audio>
    </div>
  );
}
