// CadastroConfirmation.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const CadastroConfirmation = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    setTimeout(() => navigate('/profile'), 300);
  };

  return (
    <div className="section-success">
      <button onClick={handleClose} className="close-button">
          <FaTimes size={30} />
      </button>
      <div className="center-page">
      <FaCheckCircle className='success' size={80} />
      <h1>Cadastro realizado<br/> com sucesso!</h1>
      <Button onClick={() => navigate('/profile')}>Voltar</Button>
      </div>
    </div>
  );
};

export default CadastroConfirmation;