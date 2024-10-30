// src/pages/Presentation.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Presentation = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bem-vindo ao Delivery App</h1>
      <button onClick={() => navigate('/menu')}>
        Ver Cardápio
      </button>
    </div>
  );
};

export default Presentation;
