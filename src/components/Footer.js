// src/components/Footer.js
import React from 'react';
import { FaHome, FaSearch, FaClipboardList, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  return (
    <div className="footer">
      <Link to="/" className={`footer-item ${location.pathname === '/' ? 'active' : ''}`}>
        <FaHome />
        <span>Início</span>
      </Link>
      <Link to="/search" className={`footer-item ${location.pathname === '/search' ? 'active' : ''}`}>
        <FaSearch />
        <span>Busca</span>
      </Link>
      <Link to="/orders" className={`footer-item ${location.pathname === '/orders' ? 'active' : ''}`}>
        <FaClipboardList />
        <span>Pedidos</span>
      </Link>
      <Link to="/profile" className={`footer-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <FaUser />
        <span>Perfil</span>
      </Link>
    </div>
  );
};

export default Footer;
