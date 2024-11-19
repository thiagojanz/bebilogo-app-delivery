import React, { useEffect, useState, useCallback } from 'react';
import { Flex, Radio, Form, Button, message } from 'antd';
import MD5 from 'crypto-js/md5';
import { useCart } from '../CartContext'; // Certifique-se de que o CartContext tem uma função para limpar o carrinho
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyCheck, FaClipboardList } from "react-icons/fa";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import { useNavigate, Link } from 'react-router-dom';
import SectionClient from '../components/SectionClient';

const generateRandomToken = () => MD5(Math.floor(Math.random() * 99999).toString()).toString();

const Checkout = () => {
  const { cartItems, clearCart } = useCart(); // Adicione a função clearCart do contexto
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [frete, setFrete] = useState();
  const [orderData, setOrderData] = useState({
    STATUS: '2',
    OBS: 'Pedido pelo Ap',
    ENTREGA: '1',
    PAGAMENTO: '1',
    TOKEN: generateRandomToken(),
    ID_LOJA: '2',
    ID_USUARIO: '26',
    SUBTOTAL: '0.00',
    TOTAL: '0.00',
    FRETE: '0.00',
    DATA: new Date().toISOString(),
  });

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 50);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate('/'), 300);
  };

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce((total, item) => total + (parseFloat(item.PRECO_ATUAL) || 0) * (item.quantity || 0), 0)
      .toFixed(2);
  }, [cartItems]);

  useEffect(() => {
    const calculatedTotal = calculateTotal();
    setOrderData((prevData) => ({
      ...prevData,
      SUBTOTAL: calculatedTotal,
    }));
  }, [cartItems, calculateTotal]);

  useEffect(() => {
    const freight = parseFloat(frete) || 0;
    const subtotal = parseFloat(orderData.SUBTOTAL) || 0;
    const total = (subtotal + freight).toFixed(2);

    setOrderData((prevData) => ({
      ...prevData,
      TOTAL: total,
      FRETE: frete,
    }));
  }, [orderData.SUBTOTAL, frete]);

  const handleFreteUpdate = (newFrete) => {
    setFrete(newFrete);
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      // Mostra uma mensagem de erro se o carrinho estiver vazio
      message.error('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return;
    }

    const pedidoData = {
      ...orderData,
      produtos: cartItems.map(item => ({
        produtoId: item.id,
        quantidade: item.quantity,
        precoUnitario: item.PRECO_ATUAL,
      })),
    };

    console.log('Pedido Data:', pedidoData);

    try {
      const response = await fetch(`${Api_VariavelGlobal}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      });

      const data = await response.json();
      if (response.ok) {
        // Limpa o carrinho após o pedido ser realizado
        clearCart(); // Chama a função para limpar o carrinho

        // Redireciona para a página de confirmação
        navigate('/confirmacao'); // Substitua '/confirmacao' com a rota correta para a tela de confirmação
      } else {
        alert('Erro ao realizar o pedido: ' + data.error);
      }
    } catch (error) {
      console.error('Erro de comunicação com a API:', error);
    }
  };

  const handlePaymentChange = (e) => {
    setOrderData((prevData) => ({
      ...prevData,
      PAGAMENTO: e.target.value,
    }));
  };

  const handleDeliveryChange = (e) => {
    setOrderData((prevData) => ({
      ...prevData,
      ENTREGA: e.target.value,
    }));
  };

  return (
    <div className={`checkout ${isOpen ? 'slide-in' : 'slide-out'}`}>
      <div className="container">
      <div className="left-arrow">
        <Link onClick={handleClose} className="secondary" to='/'><FaArrowLeft /></Link>
      </div>
      <h1 className="titulo-home">Resumo do Pedido</h1>

      <SectionClient onFreteUpdate={handleFreteUpdate} />

      <div className=''>
        <h3><FaMapMarkerAlt /> Opções de Entrega</h3>
        <p className='subtitulo-home'>Clique no botão para alterar.</p>
        <Flex vertical gap="middle">
          <Radio.Group className='bottom10 center'  
            name='ENTREGA' 
            value={orderData.ENTREGA} 
            buttonStyle="solid" 
            onChange={handleDeliveryChange}
          >
            <Radio.Button value="1">Delivery</Radio.Button>
          </Radio.Group>
        </Flex>
      </div>

      <div style={{paddingTop:10}} className=''>
        <h3><FaMoneyCheck /> Modelo de Pagamento</h3>
        <p className='subtitulo-home'>Clique no botão para alterar.</p>
        <Flex vertical gap="middle">
          <Radio.Group className='bottom10 center'
            name='PAGAMENTO' 
            value={orderData.PAGAMENTO} 
            buttonStyle="solid" 
            onChange={handlePaymentChange}
          >
            <Radio.Button value="1">Dinheiro</Radio.Button>
            <Radio.Button value="2">Cartão</Radio.Button>
            <Radio.Button value="3">Pix</Radio.Button>
          </Radio.Group>
        </Flex>
      </div>

      <div style={{paddingTop:10}} className=''>
        <h3><FaClipboardList /> Produtos Selecionados</h3>
        <ul className='product-list-checkout'>
          {cartItems.length > 0 ? cartItems.map((item) => (
            <li key={item.id}>
              {item.PRODUTO} - R$ {parseFloat(item.PRECO_ATUAL).toFixed(2)} x {item.quantity}
            </li>
          )) : <p>Nenhum item no carrinho...</p>}
        </ul>
      </div>

      <div className=''>        
        <Form
          onFinish={handleSubmit}
          initialValues={{
            ...orderData,
            FRETE: frete
          }}
        >   
          <div className='flex'>
            <div className='left-form'><b>Subtotal</b></div>
            <div className='right-form'><b>R$ {orderData.SUBTOTAL}</b></div>
          </div>
          <div className='flex'>
            <div className='left-form'><b>Frete</b></div>
            <div className='right-form'><b>R$ {frete}</b></div>
          </div>
          <div className='flex'>
            <div className='left-form'><b>Total</b></div>
            <div className='right-form'><b>R$ {orderData.TOTAL}</b></div>
          </div>

          {/* Botão desabilitado se o carrinho estiver vazio */}
          <Button 
            htmlType="submit" 
            className="checkout-button" 
            size="large" 
            disabled={cartItems.length === 0} // Desabilita o botão se não houver itens no carrinho
          >
            Fazer Pedido
          </Button>
        </Form>
      </div>
      </div>
    </div>
  );
};

export default Checkout;
