import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { useCart } from '../CartContext'; 
import { Flex, Spin, Button } from 'antd';
import '../global.css'; 
import { Api_VariavelGlobal } from '../global';
import { LoadingOutlined } from '@ant-design/icons';

const ProductDetails = () => {
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0);
  const { cartItems } = useCart(); // Acesse os itens do carrinho
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState(0); // Estado para o preço final
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${Api_VariavelGlobal}/api/produtos-imagens/${id}`);

        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes do produto');
        }

        const data = await response.json();
        setProduct(data);
        setFinalPrice(data.PRECO_ATUAL);  // Inicializa o preço final com o preço do produto
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Atualiza o preço final toda vez que a quantidade mudar
  useEffect(() => {
    if (product) {
      setFinalPrice(product.PRECO_ATUAL * quantity);
    }
  }, [quantity, product]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.ID_PRODUTO,
        PRODUTO: product.PRODUTO,
        PRECO_ATUAL: product.PRECO_ATUAL,
        imageUrl: product.imageUrl,
        quantity,
      });
    }
  };

  // Função para calcular o total do carrinho
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.PRECO_ATUAL) || 0) * (item.quantity || 0);
    }, 0).toFixed(2);
  }, [cartItems]);

   // Atualizar o total sempre que cartItems mudar
   useEffect(() => {
    const calculatedTotal = calculateTotal();
    setTotalAmount(calculatedTotal);
  }, [cartItems, calculateTotal]);

  const handleBuy = () => {
    handleAddToCart();    
    navigate('/checkout', { state: { totalAmount, isOpen: true } });
  };

  if (loading) {
    return <>
    <div className="loading-screen-orders loading-screen">
        <Flex className='loading-icon-screen' align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div></>;
  }

  return (
    <div className="container">
        <div className="left-arrow">
          <Link className="secondary" to='/'><FaArrowLeft /></Link>
        </div>
        <div className="center" style={{marginTop:60}}>
          <h2 className="product-title">{product.PRODUTO}</h2>
        </div>
        
        <div className="center" style={{marginTop:10}}>
        {product.imageUrl ? ( <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`}  alt={product.PRODUTO} className="product-image"/>
        ) : (
        <p>Imagem não disponível</p>
        )}
        </div>
        
        <div className="center" style={{marginTop:10}}>
          <div className="quantity-control">
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
        </div>

        <div className="center" style={{marginTop:10}}>
          <p className="product-price">Preço: R$ {finalPrice.toFixed(2)}</p> {/* Exibe o preço final */}
        </div>
      
        <div className="center" style={{marginTop:10}}>
          <Button className="buy-button-2" onClick={handleBuy}>Comprar</Button>
          <Button className="add-to-cart-button-2" onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
        </div>

        <div className="center">
            <Link onClick={() => navigate(-1)} className="continue-shopping" style={{color:"#000"}}>Continuar comprando</Link>
        </div>    
    </div>
  );
};

export default ProductDetails;
