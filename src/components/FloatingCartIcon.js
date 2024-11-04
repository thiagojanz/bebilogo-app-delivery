// src/components/FloatingCartIcon.js
import React, { useState } from 'react';
import { FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import Cart from '../pages/Cart';
import { useCart } from '../CartContext'; // Importa o contexto do carrinho

const FloatingCartIcon = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems } = useCart(); // Obtém os itens do carrinho

  // Calcula o número total de itens no carrinho
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
    <>
      <div
        onClick={toggleCart}
        style={{
          cursor: 'pointer',
          position: 'fixed',
          top: '24px',
          right: '23px',
          zIndex: 998,
          background: '#f3f3f3f3',
          padding: '10px 11px 6px 9px',
          borderRadius: '30px',
        }}
      >
        {cartOpen ? <FaChevronRight size={25} /> : <FaShoppingCart size={25} />}
        {totalItems > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '5px 8px',
              fontSize: '12px',
            }}
          >
            {totalItems}
          </span>
        )}
      </div>
      <Cart isOpen={cartOpen} onClose={toggleCart} />
    </>
  );
};

export default FloatingCartIcon;
