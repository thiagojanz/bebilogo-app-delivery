// src/components/Footer.js
import React from 'react';
import { FaHome, FaClipboardList, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext'; // Importa o contexto do carrinho
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const { cartItems } = useCart(); // Obtém os itens do carrinho

  // Calcula o número total de itens no carrinho
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="footer">
      <Link to="/" className={`footer-item ${location.pathname === '/' ? 'active' : ''}`}>
        <FaHome />
        <span>Início</span>
      </Link>
      <Link to="/profile" className={`footer-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <FaUser />
        <span>Perfil</span>
      </Link>
      <Link to="/orders" className={`footer-item ${location.pathname === '/orders' ? 'active' : ''}`}>
        <FaClipboardList />
        <span>Pedidos</span>
      </Link>
      <Link to="/shoppingcart" className={`footer-item ${location.pathname === '/shoppingcart' ? 'active' : ''}`}>
  <div style={{ position: 'relative', display: 'inline-block' }}>
    <FaShoppingCart />
    {totalItems > 0 && (
      <span
        style={{
          position: 'absolute',
          top: '-18px',
          right: '-18px',
          backgroundColor: '#ff0000bf',
          color: 'white',
          borderRadius: '50%',
          padding: '12px 10px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '8px', // Para garantir que seja um círculo
          height: '8px',
        }}
      >
        {totalItems}
      </span>
    )}
  </div>
  <span>Carrinho</span>
</Link>

    </div>
  );
};

export default Footer;
