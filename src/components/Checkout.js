// Checkout.js
import React, { useEffect, useState, useCallback } from 'react';
import MD5 from 'crypto-js/md5';
import { useCart } from '../CartContext';
import { FaArrowLeft, FaRegUser, FaUserPlus, FaUserClock, FaMapMarkerAlt, FaMoneyCheck, FaClipboardList } from "react-icons/fa";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Space, Flex, Radio, Button } from 'antd';
import Loginmodal from '../components/Loginmodal';

const generateRandomToken = () => {
  const randomNumber = Math.floor(Math.random() * (99999 - 1 + 1)) + 1;
  return MD5(randomNumber.toString()).toString();
};

const Checkout = () => {
  const [showLogin_checkout, setShowLogin] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    STATUS: '2',
    OBS: 'Pedido pelo Ap',
    ENTREGA: '',
    PAGAMENTO: '',
    TROCO: '0.00',
    TOKEN: '',
    ID_LOJA: '10',
    ID_USUARIO: '26',
    FRETE_PEDIDO: '0.00',
    SUBTOTAL: '0.00',
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
      <button onClick={handleClose} className="close-button-checkout"> <FaArrowLeft size={30} /></button>
      <h1 className="titulo-home-cart">Resumo do Pedido </h1> 
      <hr/>  

      <div className='section-client container'>
        <h3><FaUserClock /> Cliente</h3>
        <p className='subtitulo-home'>Pedido será entrega:</p>
        <div className='radio-list'>
        <p>Cliente não identificado, favor identificar-se!!!</p>
        <Space>
          <Button size='large' onClick={() => setShowLogin(true)}><FaRegUser /> Já sou Cliente </Button>
          <Button size="large"><FaUserPlus /> Novo Cliente</Button>
        </Space>
        </div>
      </div>

      {showLogin_checkout && <Loginmodal onClose={() => setShowLogin(false)} />}

      <div className='section-delivery container'>
        <h3><FaMapMarkerAlt /> Opções de Entrega</h3>
        <p className='subtitulo-home'>Clique no botão para alterar.</p>
        <div className='radio-list'>
        <Flex vertical gap="middle">
          <Radio.Group size='large' name='ENTREGA' defaultValue="1" buttonStyle="solid">
            <Radio.Button value="1">Delivery</Radio.Button>
            <Radio.Button value="2">Buscar na Loja</Radio.Button>
          </Radio.Group>
        </Flex>
        </div>
      </div>

      <div className='section-payment container'>
        <h3><FaMoneyCheck /> Modelo de Pagamento</h3>
        <p className='subtitulo-home'>Clique no botão para alterar.</p>
        <div className='radio-list'>
        <Flex vertical gap="middle">
          <Radio.Group size='large' name='PAGAMENTO' defaultValue="1" buttonStyle="solid">
            <Radio.Button value="1">Dinheiro</Radio.Button>
            <Radio.Button value="2">Cartão</Radio.Button>
            <Radio.Button value="3">Pix</Radio.Button>
          </Radio.Group>
        </Flex>
        </div>
      </div>

      <div className='section-payment container'>
        <h3><FaClipboardList /> Produtos Selecionados</h3>
        <div className='radio-list'>
          {cartItems.length > 0 ? (
          <ul className='product-list-checkout'>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.PRODUTO} - R$ {parseFloat(item.PRECO_ATUAL).toFixed(2)} x {item.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum item no carrinho...</p>    
        )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="ENTREGA" value='ENTREGA' onChange={handleChange} required />        
        <input type="hidden" name="PAGAMENTO" value='PAGAMENTO' onChange={handleChange} required />        
        <input type="hidden" name="PRODUTO" value='ID_PRODUTO' onChange={handleChange} required />        
        <input type="hidden" name="QTD" value='QTD_PRODUTO' onChange={handleChange} required />        
        <input type="hidden" name="OBS" value={orderData.OBS} onChange={handleChange} required />        
        <input type="hidden" name="TOKEN" value={orderData.TOKEN} readOnly />
        <input type="hidden" name="ID_LOJA" value={orderData.ID_LOJA} onChange={handleChange} required />
        <input type="hidden" name="ID_USUARIO" value={orderData.ID_USUARIO} onChange={handleChange} required />
        <input type="hidden" name="FRETE_PEDIDO" value={orderData.FRETE_PEDIDO} onChange={handleChange} required />
        <input type="hidden" name="SUBTOTAL" value={orderData.SUBTOTAL} onChange={handleChange} required />
        <input type="hidden" name="TOTAL" value={totalAmount} onChange={handleChange} required placeholder={totalAmount} />
        <input type="hidden" name="TOTAL_RECEBER" value={orderData.TOTAL_RECEBER} onChange={handleChange} required placeholder={totalAmount} />
        <div className='flex'>
          <div className='left-form'>Subtotal</div>
          <div className='right-form'>R$ {orderData.SUBTOTAL}</div>
        </div>
        <div className='flex'>
          <div className='left-form'>Frete</div>
          <div className='right-form'>R$ {orderData.FRETE_PEDIDO}</div>
        </div>
        <div className='flex'>
          <div className='left-form'><h3>Total</h3></div>
          <div className='right-form'><h3>R$ {totalAmount}</h3></div>
        </div>
        <div className='center'>
            <button className='back-home-button' type="submit">Fazer Pedido</button>
        </div>
      </form>
      <div className='center'>
        <button onClick={handleClose} className="continue-shopping">
              Continuar comprando
        </button>
      </div>
    </div>
  );
};

export default Checkout;
