// CadastroConfirmation.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const CadastroConfirmation = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    setTimeout(() => navigate('/orders'), 300);
  };

  return (
    <div className="section-success">
      <button onClick={handleClose} className="close-button">
          <FaTimes size={30} />
      </button>
      <div className="center-page">
      <FaCheckCircle className='success' size={80} />
      <h1>Pedido realizado<br/> com sucesso!</h1>
      <h4>Seu pedido foi recebido.</h4>
      <Button onClick={() => navigate('/orders')}>Acompanhar Pedido</Button>
      </div>
    </div>
  );
};

export default CadastroConfirmation;