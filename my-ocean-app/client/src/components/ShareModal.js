import React from 'react';

export default function ShareModal({ closeModal }) {
  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => alert('URL이 복사되었습니다!'))
      .catch(err => console.error('Copy URL failed:', err));
  };

  return (
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="cute-icon">🔗</div>
      <h2>URL 복사</h2>
      <div className="url-box">
        <span>{window.location.href}</span>
        <button onClick={copyUrl}>복사</button>
      </div>
      <button onClick={closeModal} style={{ marginTop: '10px' }}>닫기</button>
    </div>
  );
}
