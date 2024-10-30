// Checkout.js
import React, { useEffect, useState, useCallback } from 'react';
import MD5 from 'crypto-js/md5';
import { useCart } from '../CartContext';
import { FaArrowLeft } from "react-icons/fa";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const generateRandomToken = () => {
  const randomNumber = Math.floor(Math.random() * (99999 - 1 + 1)) + 1;
  return MD5(randomNumber.toString()).toString();
};

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    STATUS: '3',
    OBS: 'Pedido pelo Ap',
    ENTREGA: '',
    PAGAMENTO: '',
    TROCO: '',
    TOKEN: '',
    ID_LOJA: '10',
    ID_USUARIO: '26',
    FRETE_PEDIDO: '',
    SUBTOTAL: '',
    TOTAL: '',
    TOTAL_RECEBER: '',
    DATA: new Date().toISOString(),
  });

  useEffect(() => {
    const token = generateRandomToken();
    setOrderData((prevData) => ({ ...prevData, TOKEN: token }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${Api_VariavelGlobal}/api/pedidos`, orderData)
      .then((response) => {
        console.log('Pedido criado:', response.data);
        navigate('/order-confirmation', { state: { orderData } });
      })
      .catch((error) => {
        console.error('Erro ao criar pedido:', error);
      });
  };

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce((total, item) => total + (parseFloat(item.PRECO_ATUAL) || 0) * (item.quantity || 0), 0)
      .toFixed(2);
  }, [cartItems]);

  useEffect(() => {
    if (totalAmount === 0) {
      setTotalAmount(calculateTotal());
      setOrderData((prevData) => ({
        ...prevData,
        SUBTOTAL: calculateTotal(),
        TOTAL: calculateTotal(),
      }));
    }
  }, [calculateTotal, totalAmount]);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 50);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className={`checkout ${isOpen ? 'slide-in' : 'slide-out'}`}>
      <button onClick={handleClose} className="close-button-checkout"><FaArrowLeft size={30} /></button>
      <h1 className="titulo-home-cart">Resumo do Pedido</h1>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.PRODUTO} - R$ {item.PRECO_ATUAL.toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <div className='container'>
          <p>Nenhum item no carrinho.</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="OBS" value={orderData.OBS} onChange={handleChange} required />        
        <div>
          <label>Entrega:</label>
          <input type="text" name="ENTREGA" value={orderData.ENTREGA} onChange={handleChange} required />
        </div>
        <div>
          <label>Pagamento:</label>
          <input type="text" name="PAGAMENTO" value={orderData.PAGAMENTO} onChange={handleChange} required />
        </div>
        <div>
          <label>Troco:</label>
          <input type="number" name="TROCO" value={orderData.TROCO} onChange={handleChange} />
        </div>
          <input type="hidden" name="TOKEN" value={orderData.TOKEN} readOnly />
          <input type="hidden" name="ID_LOJA" value={orderData.ID_LOJA} onChange={handleChange} required />
          <input type="hidden" name="ID_USUARIO" value={orderData.ID_USUARIO} onChange={handleChange} required />
        <div>
          <label>Frete do Pedido:</label>
          <input type="number" name="FRETE_PEDIDO" value={orderData.FRETE_PEDIDO} onChange={handleChange} required />
        </div>
        <div>
          <label>Subtotal:</label>
          <input type="number" name="SUBTOTAL" value={orderData.SUBTOTAL} onChange={handleChange} required />
        </div>
        <div>
          <label>Total:</label>
          <input type="number" name="TOTAL" value={orderData.TOTAL} onChange={handleChange} required />
        </div>
        <div>
          <label>Total a Receber:</label>
          <input type="number" name="TOTAL_RECEBER" value={orderData.TOTAL_RECEBER} onChange={handleChange} required />
        </div>
        <div className='center'>
            <button className='back-home-button' type="submit">Finalizar Compra</button>
        </div>
      </form>
      <h2 className='pull-right'>Total: R$ {totalAmount}</h2>
    </div>
  );
};

export default Checkout;
