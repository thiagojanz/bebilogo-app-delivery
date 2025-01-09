// src/components/FloatingCartIcon.js
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Cart from '../pages/Cart';

const FloatingCartIcon = () => {
const [cartOpen, setCartOpen] = useState(false);  
const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

  return (
    <>
      <div
        onClick={toggleCart}
        style={{
          cursor: 'pointer',
          position: 'fixed',
          top: '10px',
          right: '15px',
          zIndex: 998,
          background: '#f3f3f3f3',
          padding: '10px 11px 6px 9px',
          borderRadius: '30px',
          display:'none',
        }}
      >
        {cartOpen ? <FaChevronRight size={25} /> : <FaChevronLeft size={25} />}
      </div>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default FloatingCartIcon;
