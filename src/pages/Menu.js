import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Cardápio</h1>
      {/* Mapear os itens do cardápio aqui */}
      <button onClick={() => navigate('/checkout')}>
        Ir para Checkout
      </button>
    </div>
  );
};

export default Menu;
