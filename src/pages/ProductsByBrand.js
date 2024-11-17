import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import { Spin, Button, Flex } from 'antd';
import { FaArrowLeft } from 'react-icons/fa';

const ProductsByBrand = () => {
  const { brandId } = useParams();  // Pega o ID da marca da URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [totalProducts, setTotalProducts] = useState(0); // Total de produtos para calcular a quantidade de páginas
  const productsPerPage = 4; // Número de produtos por página

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Api_VariavelGlobal}/api/produtos/marca/${brandId}?page=${currentPage}&limit=${productsPerPage}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
  
        // Verifique se a resposta contém a chave `products` e `totalProducts`
        if (data && data.products) {
          setProducts(data.products);
          setTotalProducts(data.totalProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setError('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [brandId, currentPage]);
  

  if (loading) {
    return <>
    <div className="loading-screen-orders loading-screen">
      <Flex className='loading-icon-screen' align="center">
        <Spin size="large" />
      </Flex>
    </div></>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container">
        <div className="left-arrow">
          <Link className="secondary" to='/'><FaArrowLeft /></Link>
        </div>
          <h2 className="titulo-home">Produtos da Marca</h2>
          <div className="items-list">
            <p>Nenhum produto encontrado para esta marca.</p>
          </div>
      </div>
    );
  }

  // Calcular o número total de páginas
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="container">
      <div className="left-arrow">
        <Link className="secondary" to='/'><FaArrowLeft /></Link>
      </div>
        <h2 className="titulo-home">Produtos da Marca</h2>
        <div className="items-list">
        {products.map((product) => (
  <Link key={product.ID_PRODUTO} className='text-decoration' to={`/product/${product.ID_PRODUTO}`}>
    <div className="item-card" key={product.ID_PRODUTO}>
      {product.imageUrl ? (
        <img 
          src={`https://bebilogo.com.br/uploads/${product.imageUrl}`}
          alt={product.PRODUTO} 
          className="item-image" 
        />
      ) : (
        <p>No Image</p>
      )}
      <div className="item-info">
        <h4 className="item-name">{product.PRODUTO}</h4>
        <p className="item-current-price">R$ {product.PRECO_ATUAL.toFixed(2)}</p>
      </div>
    </div>
  </Link>
))}
        </div>

        {/* Controle de Navegação */}
        <div className="pagination">
          <Button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <span style={{paddingTop:5}}> {currentPage} de {totalPages} </span>
          
          <Button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      
      <div className='center'>
          <Link to='/' className="continue-shopping">
            Continuar comprando
          </Link>
        </div>
    </div>
  );
};

export default ProductsByBrand;
