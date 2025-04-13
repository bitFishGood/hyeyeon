import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

const appCss = `
@import url('https://fonts.googleapis.com/css2?family=Jua&family=Dongle:wght@400;700&family=Gowun+Dodum&display=swap');
html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: 'Jua', 'Dongle', 'Gowun Dodum', sans-serif;
}
.app {
  position: relative;
  width: 100vw;
  max-width: 414px;
  aspect-ratio: 9 / 16;
  background: #eee;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
.background-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 400%;
  height: 100%;
  display: flex;
  transition: transform 0.6s ease;
}
.background {
  width: 25%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.fish-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.left-menu {
  position: absolute;
  top: 10%;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}
.menu-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 45px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
}
.arrow-left {
  left: 15px;
}
.arrow-right {
  right: 15px;
}
.bottom-btns {
  position: absolute;
  bottom: 3%;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}
.circle-btn {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-content {
  background: #ccc;
  color: #333;
  padding: 15px;
  border-radius: 8px;
  max-width: 280px;
  width: 100%;
  max-height: 50%;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  font-size: 14px;
  text-align: center;
  position: relative;
}
.modal-content h2 {
  margin-top: 0;
  font-size: 18px;
  margin-bottom: 10px;
}
.modal-content button {
  margin-top: 10px;
  padding: 6px 12px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.cute-icon {
  font-size: 24px;
  margin-bottom: 10px;
}
.url-box {
  display: inline-flex;
  align-items: center;
  background: #f3f3f3;
  border-radius: 6px;
  padding: 5px 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}
.url-box span {
  flex: 1;
  font-size: 14px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.url-box button {
  border: none;
  background: #bbb;
  color: #fff;
  font-size: 14px;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.bitfish-container {
  width: 414px;
  height: 736px;
  background: #222;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin: 10px auto;
}
.bitfish-content {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bitfish-card {
  padding: 20px;
  text-align: center;
}
.bitfish-btn {
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  margin: 8px;
  font-size: 16px;
  cursor: pointer;
}
.bitfish-btns-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}
.bitfish-item-box {
  margin: 15px 0;
  text-align: center;
}
`;

function useAddStyle(cssString) {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = cssString;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [cssString]);
}

export default function BitFishFlow() {
  useAddStyle(appCss);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => (prev < 6 ? prev + 1 : 6));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));
  return (
    <div className="bitfish-container">
      <div className="bitfish-content">
        {step === 1 && <Frame18 nextStep={nextStep} />}
        {step === 2 && <Frame19 nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Frame20 nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Frame21 nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Frame22 nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <DecorateView />}
      </div>
    </div>
  );
}

function Frame18({ nextStep }) {
  return (
    <div className="bitfish-card">
      <h2>친구가 들어왔어요!</h2>
      <p>미니게임을 해볼까요?</p>
      <button onClick={nextStep} className="bitfish-btn">
        미니게임
      </button>
    </div>
  );
}

function Frame19({ nextStep, prevStep }) {
  return (
    <div className="bitfish-card">
      <h2>땡땡 미니게임</h2>
      <p>재미있는 미니게임을 준비했어요!</p>
      <div className="bitfish-btns-row">
        <button onClick={prevStep} className="bitfish-btn">
          이전
        </button>
        <button onClick={nextStep} className="bitfish-btn">
          다음
        </button>
      </div>
    </div>
  );
}

function Frame20({ nextStep, prevStep }) {
  return (
    <div className="bitfish-card">
      <h2>미니게임 시작</h2>
      <button className="bitfish-btn" onClick={() => alert("게임 시작!")}>
        게임 시작
      </button>
      <button className="bitfish-btn" onClick={() => alert("게임 힌트!")}>
        미니게임 힌트
      </button>
      <button className="bitfish-btn" onClick={nextStep}>
        미니게임 나가기
      </button>
      <button className="bitfish-btn" onClick={prevStep} style={{ marginTop: "10px" }}>
        이전
      </button>
    </div>
  );
}

function Frame21({ nextStep, prevStep }) {
  return (
    <div className="bitfish-card">
      <h2>아이템 획득!</h2>
      <div className="bitfish-item-box">
        <img src="/assets/treasure.png" alt="보물 상자" style={{ width: "150px", marginBottom: "10px" }} />
        <p>짜잔~! 보물 상자를 발견했어요.</p>
      </div>
      <div className="bitfish-btns-row">
        <button className="bitfish-btn" onClick={prevStep}>
          이전
        </button>
        <button className="bitfish-btn" onClick={nextStep}>
          다음
        </button>
      </div>
    </div>
  );
}

function Frame22({ nextStep, prevStep }) {
  return (
    <div className="bitfish-card">
      <h2>새로운 물고기!</h2>
      <div className="bitfish-item-box">
        <img src="/assets/clownfish.png" alt="클라운피쉬" style={{ width: "150px", marginBottom: "10px" }} />
        <p>멋진 물고기를 획득했어요!</p>
      </div>
      <div className="bitfish-btns-row">
        <button className="bitfish-btn" onClick={prevStep}>
          이전
        </button>
        <button className="bitfish-btn" onClick={nextStep}>
          어항으로 이동
        </button>
      </div>
    </div>
  );
}

function DecorateView() {
  const username = "younk";
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [fishPaused, setFishPaused] = useState(false);
  const [modal, setModal] = useState("");
  const [inventory, setInventory] = useState([]);
  const [placedItems, setPlacedItems] = useState([]);

  useEffect(() => {
    fetch(`/api/items/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.inventory)) {
          setInventory(data.inventory);
        }
      })
      .catch((err) => console.error("아이템 불러오기 실패", err));
  }, [username]);

  const moveLeft = () => {
    if (bgIndex > 0) setBgIndex(bgIndex - 1);
  };
  const moveRight = () => {
    if (bgIndex < 3) setBgIndex(bgIndex + 1);
  };

  const captureScreen = () => {
    const appElement = document.querySelector(".app");
    if (!appElement) return;
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

  const handlePlace = (itemId) => {
    setPlacedItems((prev) => [...prev, itemId]);
  };

  const handleSubmit = () => {
    fetch(`/api/ocean/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: placedItems }),
    })
      .then((res) => {
        if (res.ok) {
          alert("어항을 꾸며줬어요!");
          navigate(`/ocean/${username}`);
        } else {
          alert("저장 실패 ㅠㅠ");
        }
      });
  };

  return (
    <div className="app">
      <div className="background-wrap" style={{ transform: `translateX(-${bgIndex * 25}%)` }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="background" style={{ backgroundImage: "url('/background.png')" }}></div>
        ))}
      </div>
      <div className="fish-container" style={{ animationPlayState: fishPaused ? "paused" : "running" }}>
        {placedItems.map((itemId, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${20 + i * 10}%`,
              left: `${20 + i * 10}%`,
            }}
          >
            🐚
          </div>
        ))}
      </div>
      <div className="left-menu">
        <button className="menu-btn" onClick={() => setModal("help")}>📜</button>
        <button className="menu-btn" onClick={() => setModal("setting")}>⚙️</button>
        <button className="menu-btn" onClick={() => setModal("copy")}>🔗</button>
        <button className="menu-btn" onClick={() => navigate("/")}>⬅️</button>
      </div>
      <button className="arrow arrow-left" onClick={moveLeft}>⬅</button>
      <button className="arrow arrow-right" onClick={moveRight}>➡</button>
      <div className="bottom-btns">
        <button className="circle-btn" onClick={captureScreen}>📷</button>
      </div>
      {modal && (
        <div className="modal" onClick={() => setModal("")}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal === "help" && (
              <>
                <div className="cute-icon">😊</div>
                <h2>도움말</h2>
                <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                  <li>아이템을 선택해서 친구 어항에 배치할 수 있어요.</li>
                  <li>게임을 통해 얻은 아이템이 여기에 보여요.</li>
                </ul>
              </>
            )}
            {modal === "setting" && (
              <>
                <div className="cute-icon">🎛️</div>
                <h2>설정</h2>
                <div className="setting-options">
                  <div
                    className="setting-option"
                    onClick={() => {
                      setMusicPlaying(!musicPlaying);
                      alert(musicPlaying ? "음악이 정지됩니다." : "음악이 재생됩니다.");
                    }}
                  >
                    🔇
                  </div>
                  <div
                    className="setting-option"
                    onClick={() => {
                      setFishPaused(!fishPaused);
                      alert(fishPaused ? "물고기 애니메이션이 정지되었습니다." : "물고기 애니메이션이 재생됩니다.");
                    }}
                  >
                    ⏸️
                  </div>
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
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button
          className="menu-btn"
          style={{ fontSize: "0.9rem", padding: "8px 12px", background: "#00bcd4" }}
          onClick={() => alert("미니게임으로 이동! (연결 필요)")}
        >
          🎮 게임해서 아이템 얻기
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "20px",
          background: "#fff",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>🎁 친구가 가진 아이템</h3>
        {inventory.length === 0 ? (
          <p>아이템 없음</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {inventory.map((item) => (
              <li key={item._id} style={{ marginTop: "5px" }}>
                🐚 {item.name}
                <button onClick={() => handlePlace(item._id)} style={{ marginLeft: "10px" }}>
                  배치
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        style={{ position: "absolute", bottom: "20px", right: "20px" }}
        onClick={handleSubmit}
      >
        저장하고 친구에게 보내기 ✨
      </button>
      <audio id="captureSound" src="capture.mp3"></audio>
    </div>
  );
}
