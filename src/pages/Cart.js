import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { SlTrash } from "react-icons/sl";
import { FaArrowLeft, FaArrowCircleRight } from "react-icons/fa";
import { Button } from 'antd';
import '../global.css';

const Cart = ({ isOpen, onClose }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const increaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      updateCartItemQuantity(itemId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(itemId, item.quantity - 1);
    }
  };

  const calculateItemSubtotal = (item) => {
    return (parseFloat(item.PRECO_ATUAL) || 0) * (item.quantity || 0);
  };

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0).toFixed(2);
  }, [cartItems]);

  useEffect(() => {
    setTotalAmount(calculateTotal());
  }, [cartItems, calculateTotal]);

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalAmount, isOpen: true } });
  };

  return (
    <div className={`cart-slide-in ${isOpen ? 'open' : ''}`}>
      <div className="container Cart-section">
        <div className="left-arrow">
          <Link className="secondary" onClick={onClose}><FaArrowLeft /></Link>
        </div>
        <h1 className="titulo-home">Carrinho de Compras</h1>
        <div className="Cart-list">
          {cartItems.length === 0 ? (
            <p className='center'>O carrinho está vazio</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="item-card-cart">
                {item.imageUrl ? (
                  <img
                    src={`https://bebilogo.com.br/uploads/${item.imageUrl}`}
                    alt={item.PRODUTO}
                    className="item-image"
                    onError={(e) => (e.target.src = '/path/to/placeholder-image.jpg')}
                  />
                ) : (
                  <p>Imagem não disponível</p>
                )}
                <div className="item-info">
                  <p className="item-name">{item.PRODUTO}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item-button">
                    <SlTrash size={20} />
                  </button>
                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <p className="item-total">
                    R$ {calculateItemSubtotal(item).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="container center">
          <div className="flex_profile">
            <Button type="default" size="large" onClick={handleCheckout}>
              Finalizar Pedido <span style={{ marginLeft: 10 }}>
                <FaArrowCircleRight size={22} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
