import React, { useEffect, useState } from 'react';
import { Api_VariavelGlobal } from '../global';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';

const ProductsCategory = () => {
  const { idCategoria } = useParams(); // Captura o idCategoria da URL
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idCategoria) {
      fetch(`${Api_VariavelGlobal}/api/produtos/categoria/${idCategoria}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          } else {
            setProducts([]);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar produtos:', error);
          setError('Erro ao carregar produtos. Tente novamente.');
          setIsLoading(false);
        });
    }
  }, [idCategoria]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <p>Nenhum produto encontrado para esta categoria.</p>;
  }

  return (
    <div className="products-category">
      <h2>Produtos da Categoria</h2>
      <ul>
        {products.map(product => (
          <li key={product.ID_PRODUTO}>
            <h3>{product.NOME}</h3>
            <img
              src={`https://bebilogo.com.br/uploads_produtos/${product.IMAGEM}`}
              alt={product.NOME}
            />
            <p>{product.DESCRICAO}</p>
            <span>R${product.PRECO}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsCategory;
