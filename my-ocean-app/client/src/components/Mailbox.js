import React from 'react';

export default function Mailbox({ letters, token, setLetters, closeModal }) {
  const handleDelete = (letterId) => {
    if (!window.confirm('이 편지를 삭제할까요?')) return;
    fetch(`/api/letters/${letterId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setLetters(prev => prev.filter(letter => letter._id !== letterId));
        } else {
          alert('편지 삭제 실패');
        }
      })
      .catch(err => console.error('Delete letter error:', err));
  };

  const handleReply = (toId) => {
    const content = window.prompt('답장 내용:');
    if (!content) return;
    fetch('/api/letters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content, to: toId })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          alert('답장을 보냈습니다!');
        } else {
          alert('답장 보내기 실패');
        }
      })
      .catch(err => {
        console.error('Reply error:', err);
        alert('답장 보내기 실패');
      });
  };

  return (
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="cute-icon">📩</div>
      <h2>편지함</h2>
      {letters.length === 0 ? (
        <p>받은 편지가 없습니다.</p>
      ) : (
        <div style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
          {letters.map(letter => (
            <div key={letter._id} style={{ border: '1px solid #aaa', borderRadius: '4px', padding: '5px', marginBottom: '5px' }}>
              <div><b>{letter.fromName || '알 수 없음'}:</b> {letter.content}</div>
              <div style={{ textAlign: 'right' }}>
                {letter.fromId && <button onClick={() => handleReply(letter.fromId)} style={{ marginRight: '5px' }}>답장</button>}
                <button onClick={() => handleDelete(letter._id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={closeModal} style={{ marginTop: '10px' }}>닫기</button>
    </div>
  );
}
