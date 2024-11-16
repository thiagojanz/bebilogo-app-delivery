// AlteracaoConfirmation.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaHistory, FaTimes } from "react-icons/fa";

const AlteracaoConfirmation = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    setTimeout(() => navigate('/profile'), 300);
  };

  return (
    <div className="section-success">
      <button onClick={handleClose} className="close-button">
          <FaTimes size={30} />
      </button>
      <div className="center">
      <FaHistory className='default' size={80} />
      <h1>Cadastro alterado<br/> com sucesso!</h1>
      <p>Seus dados foram registrados com sucesso.</p>
      <Button onClick={() => navigate('/profile')}>Voltar</Button>
      </div>
    </div>
  );
};

export default AlteracaoConfirmation;