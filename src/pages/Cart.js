import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { SlTrash } from "react-icons/sl";
import { FaArrowLeft, FaArrowCircleRight } from "react-icons/fa";
import { Button } from 'antd';
import '../global.css';

const Cart = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart(); // Acesse os itens do carrinho
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

  // Função para calcular o subtotal de cada item
  const calculateItemSubtotal = (item) => {
    return (parseFloat(item.PRECO_ATUAL) || 0) * (item.quantity || 0);
  };

  // Função para calcular o total do carrinho
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemSubtotal(item);
    }, 0).toFixed(2);
  }, [cartItems]);

  // Atualizar o total sempre que cartItems mudar
  useEffect(() => {
    const calculatedTotal = calculateTotal();
    setTotalAmount(calculatedTotal);
  }, [cartItems, calculateTotal]);

  const handleCheckout = () => {
    navigate('/checkout', { state: { totalAmount, isOpen: true } });
  };

  return (
    <div className={`cart-slide-in ${isOpen ? 'open' : ''}`}>
      <div className="container Cart-section">
        <div className="left-arrow">
          <Link onClick={onClose} className="secondary" to='/'><FaArrowLeft /></Link>
        </div>
        <h1 className="titulo-home">Carrinho de Compras</h1>
        <div className="Cart-list">
          {cartItems.length === 0 ? (
            <p>O carrinho está vazio</p>
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
                    R$ {calculateItemSubtotal(item).toFixed(2)} {/* Subtotal de cada item */}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className='container center'>
          <div className='flex_profile'>
            <Button type="default" size='large' onClick={handleCheckout}>
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
