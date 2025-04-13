import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Archive({ token }) {
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('/api/items', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.inventory) {
            setInventory(data.inventory);
          }
        })
        .catch(err => console.error('Failed to fetch inventory:', err));
    }
  }, [token]);

  const handlePlace = (itemId) => {
    fetch(`/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ placed: true })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          alert('아이템을 어항에 배치했습니다!');
          navigate('/aquarium');
        } else {
          alert('아이템 배치 실패');
        }
      })
      .catch(err => {
        console.error('Place item error:', err);
        alert('아이템 배치 실패');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>보관함</h2>
      {inventory.length === 0 ? (
        <p>보관함이 비었습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {inventory.map(item => (
            <li key={item._id} style={{ marginBottom: '10px' }}>
              <span style={{ marginRight: '10px' }}>🐚 {item.name}</span>
              <button onClick={() => handlePlace(item._id)}>배치</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/aquarium')}>← 돌아가기</button>
    </div>
  );
}
