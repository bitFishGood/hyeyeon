import React from 'react';

export default function HelpModal({ closeModal }) {
  return (
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="cute-icon">😊</div>
      <h2>사용설명서</h2>
      <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
        <li>쓰레기통 버튼으로 어항에 놓인 아이템을 제거할 수 있습니다.</li>
        <li>물고기를 눌러 편지를 확인해보세요! (현재는 좌측 편지함 아이콘을 이용하세요)</li>
        <li>답신 기능으로 친구에게 답장을 보낼 수 있습니다.</li>
        <li>편지함에는 친구들이 보낸 메시지가 저장됩니다.</li>
        <li>URL 복사 기능으로 친구들에게 어항을 공유할 수 있습니다.</li>
      </ul>
      <button onClick={closeModal} style={{ marginTop: '10px' }}>닫기</button>
    </div>
  );
}
