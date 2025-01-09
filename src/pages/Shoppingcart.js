import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext'; // Adjust the path accordingly
import { Flex, Form, Button, message, Card } from 'antd';
import MD5 from 'crypto-js/md5';
import { SlTrash } from "react-icons/sl";
import { Api_VariavelGlobal } from '../global';
import '../global.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowCircleRight, FaCubes } from "react-icons/fa";

const Shoppingcart = () => { 
  const { cartItems, addToCart, removeFromCart, updateCartItemQuantity, calculateTotal } = useCart();  
  const generateRandomToken = () => MD5(Math.floor(Math.random() * 99999).toString()).toString();
  const navigate = useNavigate();
  const [setLoading] = useState(true);
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
    DATA: new Date().toISOString(),
  });

  // Gerenciamento de quantidade por produto
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const calculatedTotal = calculateTotal();
    setOrderData((prevData) => ({
      ...prevData,
      SUBTOTAL: calculatedTotal,
    }));
  }, [cartItems, quantities, calculateTotal]);

  useEffect(() => {
    const subtotal = parseFloat(orderData.SUBTOTAL) || 0;
    const total = (subtotal).toFixed(2);

    setOrderData((prevData) => ({
      ...prevData,
      TOTAL: total,
    }));
  }, [orderData.SUBTOTAL]);

  const handleSubmit = async () => {
    setLoading(true);
    if (cartItems.length === 0) {
      message.error('Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.');
      return;
    }

    const pedidoData = {
      ...orderData,
      produtos: cartItems.map(item => ({
        produtoId: item.id,
        quantidade: quantities[item.id] || 1,
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
        navigate('/confirmacao'); // Redireciona para a tela de confirmação
      } else {
        alert('Erro ao realizar o pedido: ' + data.error);
      }
    } catch (error) {
      console.error('Erro de comunicação com a API:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { isOpen: true } });
  };

  const increaseQuantity = (itemId) => {
    // Atualiza a quantidade local (não no carrinho diretamente)
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1, // Incrementa a quantidade local
    }));
  
    // Atualiza o carrinho com a nova quantidade
    const existingItem = cartItems.find((item) => item.id === itemId);
    if (existingItem) {
      // Se o item já está no carrinho, atualiza a quantidade
      updateCartItemQuantity(itemId, existingItem.quantity + 1);
    } else {
      // Se o item não existe no carrinho, adiciona com a nova quantidade
      addToCart({
        id: itemId,
        quantity: 1, // Adiciona com quantidade 1
      });
    }
  };
  

  const decreaseQuantity = (itemId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 1) - 1, 1), // Decrementa a quantidade local
    }));
  
    const existingItem = cartItems.find((item) => item.id === itemId);
    if (existingItem) {
      // Se a quantidade for 1, removemos o item do carrinho
      if (existingItem.quantity === 1) {
        removeFromCart(itemId);
      } else {
        // Caso contrário, atualizamos a quantidade no carrinho
        updateCartItemQuantity(itemId, existingItem.quantity - 1);
      }
    }
  };
  

  return (
    <div className="">
      <div className="container">
        <h1 className="titulo-home center">Carrinho de Compra</h1>    
        <div className=''>
          <Card title={<><FaCubes size={20} /> <h3 style={{display:'contents'}}>{'Produto(s) Selecionado(s)'}</h3> <br/> <p className="subtitulo-home"> {'Lista com seus produtos:'} </p></>} 
            bordered={true} style={{ width: '100%', marginBottom: '20px' }}>
            <Flex vertical style={{padding: '0px 0px 0px 0px'}}>

              <ul className="product-list-checkout" style={{ listStyle: 'none', padding: 0 }}>

                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <ul key={item.id} style={{ listStyle: 'none', padding: '0', margin: '0', borderBottom: '1px solid #00000020' }}>
                      <div className="card flex">
  <div className="card-image" style={{minWidth: '90px', maxWidth: '120px'}}>
  <span>
        {item.imageUrl ? (
          <img 
            src={`https://bebilogo.com.br/uploads/${item.imageUrl}`} 
            alt={item.PRODUTO} 
            className="product-image" 
            style={{ maxWidth: '100%', height: 'auto' }} // ajusta o tamanho da imagem
          />
        ) : (
          <p>Imagem não disponível</p>
        )}
      </span>
  </div>
  <div className="card-details" style={{minwidth: '300px', width:'100%'}}>
    <div className="card-line">
    <div style={{ fontWeight: '400', fontSize: '14px', marginBottom: '5px' }}>
        {item.PRODUTO}
      </div>
    </div>
    <div className="card-line">
      <strong>Preço:</strong>
      <span> R$ {(parseFloat(item.PRECO_ATUAL) * (quantities[item.id] || 1)).toFixed(2)}</span>
    </div>
    <div className="card-line">
    <div className="quantity-control" style={{ marginLeft: '-6px', paddingTop:'10px' }}>
      <button 
        onClick={() => decreaseQuantity(item.id)} 
        style={{ fontSize: '20px', margin: '0 5px' }}
      >
        -
      </button>
      <span>{item.quantity}</span>
      
      
      <button 
        onClick={() => increaseQuantity(item.id)} 
        style={{ fontSize: '20px', margin: '0 5px' }}
      >
        +
      </button>
    </div>
    </div>
  </div>
  <div className="card-icon" style={{marginRight:'5px'}}>
  <div className="remove-item" style={{ marginLeft: '20px' }}>
      <button 
        onClick={() => removeFromCart(item.id)} 
        style={{ background: 'transparent', border: 'none' }}
      >
        <SlTrash size={20} />
      </button>
    </div>
  </div>
</div>
</ul>
))) : (
<p style={{ color: 'red' }}>Nenhum item no carrinho...</p>
)}
              </ul>
            </Flex>
          </Card>  
        </div>

        <div className=''>        
          <Form onFinish={handleSubmit} initialValues={{ ...orderData }}>
            <div className="flex" style={{fontSize: '24px', borderRadius: '10px', padding:'10px 10px 10px 10px'}}>
              <div className='left-form'><b>Total</b></div>
              <div className='right-form'><b>R$ {calculateTotal()}</b></div>
            </div>

            {/* Botão desabilitado se o carrinho estiver vazio */}
            <div className="container center">
              <div className="flex_profile" style={{paddingTop:'30px'}}>
                <Button type="default" size="large" onClick={handleCheckout}>Finalizar Pedido <p style={{ fontSize: '25px' }}><FaArrowCircleRight /></p></Button>
              </div>
            </div>
          </Form>
        </div>  
      </div>
      <div className="center">
            <Link onClick={() => navigate(-1)} className="continue-shopping" style={{color:"#000"}}>Continuar comprando</Link>
        </div> 
    </div>
  );
};

export default Shoppingcart;
