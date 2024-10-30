  // OrderConfirmation.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import '../global.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {}; // Get order details from navigation state

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="confirmation-screen">
        <div className="container texto-home">
      <h1 className="titulo-home">Pedido Concluído</h1>
      {orderData ? (
        <div>
          <div className='center'>
            <FaCheckCircle size={50} />
          </div>
          <h2>Obrigado pela Preferência!</h2>
          <p><strong>ID do Pedido:</strong> {orderData.TOKEN}</p>
          <p><strong>Total:</strong> R$ {orderData.TOTAL}</p>
          <p><strong>Data do Pedido:</strong> {new Date(orderData.DATA).toLocaleDateString()}</p>
          {/* Outras informações do pedido podem ser exibidas aqui */}
        </div>
      ) : (
        <p>Informações do pedido não disponíveis.</p>
      )}
      <div className='center'>
      <button onClick={handleBackToHome} className="back-home-button">Voltar para Início</button>
      </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

