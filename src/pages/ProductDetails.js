import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext'; 
import '../global.css'; 
import { Api_VariavelGlobal } from '../global';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${Api_VariavelGlobal}/api/produtos-imagens/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes do produto');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

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

  const handleBuy = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (!product) return <p>Carregando...</p>;

  return (
    <div className="product-details slide-in">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={35} />
      </button>
      <h2 className="product-title">{product.PRODUTO}</h2>
      {product.imageUrl ? (
        <img 
          src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} 
          alt={product.PRODUTO} 
          className="product-image" 
        />
      ) : (
        <p>Imagem não disponível</p>
      )}
      <div className="quantity-control">
        <button onClick={decreaseQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity}>+</button>
      </div>
      <p className="product-price">Preço: R$ {product.PRECO_ATUAL.toFixed(2)}</p>
      <div className="button-group">
        <button className="buy-button" onClick={handleBuy}>Comprar</button>
        <button className="add-to-cart-button" onClick={handleAddToCart}>Adicionar ao Carrinho</button>
      </div>
      <button onClick={() => navigate(-1)} className="continue-shopping">
            Continuar comprando
      </button>
    </div>
  );
};

export default ProductDetails;
