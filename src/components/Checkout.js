import React, { useEffect, useState, useCallback } from 'react';
import { Flex, Radio, Form, Button, message, Card } from 'antd';
import MD5 from 'crypto-js/md5';
import { useCart } from '../CartContext'; // Certifique-se de que o CartContext tem uma função para limpar o carrinho
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyCheck, FaClipboardList } from "react-icons/fa";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import { useNavigate, Link } from 'react-router-dom';
import SectionClient from '../components/SectionClient';

const Checkout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generateRandomToken = () => MD5(Math.floor(Math.random() * 99999).toString()).toString();
  const [isFreteLoading, setIsFreteLoading] = useState(true);
  const { cartItems, clearCart } = useCart(); // Adicione a função clearCart do contexto
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [frete, setFrete] = useState();
  const [orderData, setOrderData] = useState({
    STATUS: '3',
    OBS: 'Pedido pelo Ap',
    ENTREGA: '1',
    PAGAMENTO: '1',
    TOKEN: generateRandomToken(),
    ID_LOJA: '0',
    ID_USUARIO: localStorage.getItem('userId'),
    SUBTOTAL: '0.00',
    TOTAL: '0.00',
    FRETE: '0.00',
    DATA: new Date().toISOString(),
  });

  useEffect(() => {
    if (frete) {
      setIsFreteLoading(false);
    }
  }, [frete]);

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
      message.error('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return;
    }
  
    setIsSubmitting(true); // Ativa o estado de carregamento
  
    const pedidoData = {
      ...orderData,
      produtos: cartItems.map(item => ({
        produtoId: item.id,
        quantidade: item.quantity,
        precoUnitario: item.PRECO_ATUAL,
      })),
    };
  
    try {
      const response = await fetch(`${Api_VariavelGlobal}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData),
      });
  
      const data = await response.json();
      if (response.ok) {
        clearCart(); // Limpa o carrinho
        navigate('/confirmacao'); // Redireciona para a tela de confirmação
      } else {
        alert('Erro ao realizar o pedido: ' + data.error);
      }
    } catch (error) {
      console.error('Erro de comunicação com a API:', error);
    } finally {
      setIsSubmitting(false); // Desativa o estado de carregamento
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
      <h1 className="titulo-home center">Resumo do Pedido</h1>

      <SectionClient onFreteUpdate={handleFreteUpdate} />

      <div className=''>
      <Card title={<><FaMapMarkerAlt size={20} /> <h3 style={{display:'contents'}}>{'Opções de Entrega'}</h3> <br/> <p className="subtitulo-home"> {'Clique no botão para alterar:'} </p></>} 
      bordered={true} style={{ width: '100%', marginBottom: '20px' }}>      
        <Flex vertical gap="middle">
          <Radio.Group defaultValue="1" className='bottom10 center' name='ENTREGA' buttonStyle="solid" onChange={handleDeliveryChange}>
            <Radio.Button value="1">Delivery</Radio.Button>
            <Radio.Button disabled value="2">Buscar na Loja</Radio.Button>
            <Radio.Button disabled value="3">Agendado</Radio.Button>
          </Radio.Group>
        </Flex>
        </Card>
      </div>

      <div className=''>
      <Card title={<><FaMoneyCheck size={20} /> <h3 style={{display:'contents'}}>{'Modelo de Pagamento'}</h3> <br/> <p className="subtitulo-home"> {'Clique no botão para alterar:'} </p></>} 
      bordered={true} style={{ width: '100%', marginBottom: '20px' }}>      
        <Flex vertical gap="middle">
        <Radio.Group defaultValue="1" className='bottom10 center' name='PAGAMENTO' buttonStyle="solid" onChange={handlePaymentChange}>
            <Radio.Button value="1">Dinheiro</Radio.Button>
            <Radio.Button value="2">Cartão</Radio.Button>
            <Radio.Button value="3">Pix</Radio.Button>
          </Radio.Group>
        </Flex>
        </Card>
      </div>

      <div className=''>
      <Card 
  title={
    <>
      <FaClipboardList size={20} /> 
      <h3 style={{ display: 'contents' }}>{'Produtos Selecionados'}</h3> 
      <br /> 
      <p className="subtitulo-home">{'Lista com seus produtos:'}</p>
    </>
  }
  bordered={true} 
  style={{ width: '100%', marginBottom: '20px' }}
>
  <Flex vertical>
    <ul className="product-list-checkout" style={{ listStyle: 'none', padding: 0 }}>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <li 
            key={item.id} 
            style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
            }}
          >
            <span>
              {item.PRODUTO} - R$ {parseFloat(item.PRECO_ATUAL).toFixed(2)} x {item.quantity}
            </span>
            <span style={{ fontWeight: 'bold' }}>
              R$ {(parseFloat(item.PRECO_ATUAL) * item.quantity).toFixed(2)}
            </span>
          </li>
        ))
      ) : (
        <p style={{ color: 'red' }}>Nenhum item no carrinho...</p>
      )}
    </ul>
  </Flex>
</Card>

      </div>

      <div className=''>        
        <Form
          onFinish={handleSubmit}
          initialValues={{
            ...orderData,
            FRETE: frete
          }}
        >   
          <div className='flex' style={{fontSize: '20px', padding:'0px 10px 0px 10px'}}>
            <div className='left-form'><b>Subtotal</b></div>
            <div className='right-form'><b>R$ {orderData.SUBTOTAL}</b></div>
          </div>
          <div className="flex" style={{fontSize: '20px', padding:'0px 10px 10px 10px'}}>
            <div className="left-form"><b>Frete</b></div>
            <div className="right-form">
              <b>{isFreteLoading ? 'Aguardando...' : `R$ ${frete}`}</b>
            </div>
          </div>
          <div className="flex" style={{fontSize: '24px', backgroundColor:'black', borderRadius: '10px', color: 'white', padding:'10px 10px 10px 10px'}}>
            <div className='left-form'><b>Total</b></div>
            <div className='right-form'><b>R$ {orderData.TOTAL}</b></div>
          </div>

          {/* Botão desabilitado se o carrinho estiver vazio */}
          <Button
            htmlType="submit"
            className="checkout-button"
            size="large"
            disabled={cartItems.length === 0 || !frete || parseFloat(frete) <= 0}
            loading={isSubmitting} // Mostra a animação de carregamento
            style={{
              marginTop: '30px', // Adiciona espaço acima
              marginBottom: '60px', // Adiciona espaço abaixo
              padding: '16px 100px', // Aumenta o tamanho do botão
              fontSize: '16px', // Mantém o tamanho da fonte
            }}
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
