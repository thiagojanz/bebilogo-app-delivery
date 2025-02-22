import React, { useEffect, useState, useCallback } from 'react';
import { Flex, Radio, Form, Button, message, Card } from 'antd';
import MD5 from 'crypto-js/md5';
import { useCart } from '../CartContext'; // Certifique-se de que o CartContext tem uma função para limpar o carrinho
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyCheck, FaCubes } from "react-icons/fa";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import { useNavigate, Link } from 'react-router-dom';
import SectionClient from '../components/SectionClient';

const OrderSummary = () => {
  const [setIsSubmitting] = useState(false);
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
    setTimeout(() =>  navigate('/shoppingcart'), 300);
    setIsOpen(false);    
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
      
      if (response.ok) {
        clearCart(); // Limpa o carrinho
        navigate('/confirmacao'); // Redireciona para a tela de confirmação
      } else {
        message.error('Erro ao realizar o pedido, favor tentar novamente...');
        //message.error('Erro ao realizar o pedido: ' + data.error);
      }
    } catch (error) {
      message.error('Erro de comunicação com a API:', error);
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

  const handleCheckout = () => {
    navigate('/checkout', { state: { isOpen: true } });
  };

  return (
    <div className={`summary ${isOpen ? 'slide-in' : 'slide-out'}`}>
      <div className="container">
      <div className="left-arrow">
        <Link onClick={handleClose}  className="secondary" to='/'><FaArrowLeft /></Link>
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
      <Card title={<><FaCubes size={20} /> <h3 style={{display:'contents'}}>{'Produto(s) Selecionado(s)'}</h3> <br/> <p className="subtitulo-home"> {'Lista com seus produtos:'} </p></>} 
      bordered={true} style={{ width: '100%', marginBottom: '20px' }}>      
  <Flex vertical>
    <ul className="product-list-summary" style={{ listStyle: 'none', padding: 0 }}>
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
            <span><span style={{ fontWeight: 'bold' }}>{item.PRODUTO}</span>
            <br/><span style={{fontWeight:'300px'}}>{item.quantity}</span> x R$ {parseFloat(item.PRECO_ATUAL).toFixed(2)}</span>
            <span style={{ fontWeight: 'bold' }}>R$ {(parseFloat(item.PRECO_ATUAL) * item.quantity).toFixed(2)}</span>
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
          <div className='flex' style={{fontSize: '18px', padding:'0px 10px 0px 10px'}}>
            <div className='left-form'><b>Subtotal</b></div>
            <div className='right-form'><b>R$ {orderData.SUBTOTAL}</b></div>
          </div>
          <div className="flex" style={{fontSize: '18px', padding:'0px 10px 10px 10px'}}>
            <div className="left-form"><b>Frete</b></div>
            <div className="right-form">
              <b>{isFreteLoading ? 'Aguardando...' : `R$ ${frete}`}</b>
            </div>
          </div>
          <div className="flex" style={{fontSize: '20px', backgroundColor:'#f5f5f5', borderRadius: '10px', padding:'10px 10px 10px 10px'}}>
            <div className='left-form'><b>Total</b></div>
            <div className='right-form'><b>R$ {orderData.TOTAL}</b></div>
          </div>

          {/* Botão desabilitado se o carrinho estiver vazio */}
          <Button
            htmlType="submit"
            className="checkout-button"
            size="large"
            disabled={cartItems.length === 0 || !frete || parseFloat(frete) <= 0}
            onClick={handleCheckout} // Mostra a animação de carregamento
            style={{
              marginTop: '30px', // Adiciona espaço acima
              padding: '16px 100px', // Aumenta o tamanho do botão
              fontSize: '16px', // Mantém o tamanho da fonte
            }}
          >
          Ir para Pagamento
        </Button>
        </Form>
      </div>
      </div>
      <div className="center">
            <Link to="/" className="continue-shopping" style={{color:"#000", marginBottom: '60px'}}>Continuar comprando</Link>
        </div> 
    </div>
  );
};

export default OrderSummary;
