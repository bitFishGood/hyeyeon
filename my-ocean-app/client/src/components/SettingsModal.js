// SettingsModal.jsx
import React from "react";
import "./SettingsModal.css";

export default function SettingsModal({
  closeModal
}) {
  return (
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <h2>설정</h2>
      <div className="option-container">
        {/* 첫 번째 아이콘 블록 */}
        <div className="option-block">
          <div className="option-icon">🎧</div>
          <div className="option-text">on/off</div>
        </div>

        {/* 두 번째 아이콘 블록 */}
        <div className="option-block">
          <div className="option-icon">⏹️</div>
          <div className="option-text">on/off</div>
        </div>
      </div>

      <button onClick={closeModal} style={{ marginTop: "10px" }}>
        닫기
      </button>
    </div>
  );
}
