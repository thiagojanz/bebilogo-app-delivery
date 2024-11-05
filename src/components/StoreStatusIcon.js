import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreStatusIcon = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios.get('/api/status-loja')
      .then(response => {
        setStatus(response.data.STATUS);
      })
      .catch(error => {
        console.error('Erro ao buscar status da loja:', error);
      });
  }, []);

  return (
    <div>
      {status === 1 ? (
        <span style={{ color: 'green' }}>🟢 Loja Aberta</span>
      ) : (
        <span style={{ color: 'red' }}>🔴 Loja Fechada</span>
      )}
    </div>
  );
};

export default StoreStatusIcon;
