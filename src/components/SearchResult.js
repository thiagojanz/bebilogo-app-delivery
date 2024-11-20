import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import SearchComponent from '../components/SearchComponent';
import { Spin, Button, Flex, Rate } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useCart } from '../CartContext';
import { FaTag } from 'react-icons/fa';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [value, setValue] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${Api_VariavelGlobal}/api/produtos/search/?query=${encodeURIComponent(query)}`),
          fetch(`${Api_VariavelGlobal}/api/categorias`),
        ]);

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories([{ CATEGORIA: 'Todos', ID_CATEGORIA: null }, ...categoriesData]);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.ID_PRODUTO,
      PRODUTO: product.PRODUTO,
      PRECO_ATUAL: product.PRECO_ATUAL,
      imageUrl: product.imageUrl,
      quantity: quantities[product.ID_PRODUTO] || 1,
    });
  };

  const handleBuy = (product) => {
    handleAddToCart(product);
    navigate('/checkout', {
      state: {
        totalAmount: product.PRECO_ATUAL * (quantities[product.ID_PRODUTO] || 1),
        isOpen: true,
      },
    });
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const desc = ['Muito Ruim', 'Ruim', 'Normal', 'Bom', 'Excelente'];

  // Obter produtos da página atual
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="search-results">
      <SearchComponent />
      {query && <p>Você pesquisou por: {query}</p>}

      <div className="item-list">
        {isLoading ? (
          <div className="loading-screen-orders loading-screen">
            <Flex className="loading-icon-screen" align="center">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </Flex>
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const productCategory = categories.find(
              (category) => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA)
            );

            return (
              <div className="item-card" key={product.ID_PRODUTO}>
                {product.imageUrl ? (
                  <Link to={`/product/${product.ID_PRODUTO}`} className="text-decoration">
                    <img
                      src={`https://bebilogo.com.br/uploads/${product.imageUrl}`}
                      alt={product.PRODUTO}
                      className="item-image"
                    />
                  </Link>
                ) : (
                  <p>Imagem não disponível</p>
                )}
                <div className="item-info">
                  <h4 className="item-name">{product.PRODUTO}</h4>
                  <div className="item-category">
                    <FaTag /> {productCategory?.CATEGORIA || 'Categoria não encontrada'}
                  </div>
                  <div className="flex">
                    <div className="item-current-price">
                      <b>R$ {(product.PRECO_ATUAL * (quantities[product.ID_PRODUTO] || 1)).toFixed(2)}</b>
                      <Flex gap="middle" vertical>
                        <Rate tooltips={desc} onChange={setValue} value={value} />
                      </Flex>
                    </div>

                    <div className="quantity-control">
                      <button onClick={() => decreaseQuantity(product.ID_PRODUTO)}>-</button>
                      <span>{quantities[product.ID_PRODUTO] || 1}</span>
                      <button onClick={() => increaseQuantity(product.ID_PRODUTO)}>+</button>
                    </div>
                  </div>

                  <div className="item-actions">
                    <Button className="buy-button" onClick={() => handleBuy(product)}>
                      Comprar
                    </Button>
                    <Button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>Nenhum produto encontrado na busca!</p>
        )}
      </div>

      {/* Componente de Paginação */}
      <div className="pagination">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        <span className="pagination-info">{currentPage} de {totalPages}</span>

        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>

      <div className="continue-shopping center bottom30">
        <Link to="/">Continuar comprando</Link>
      </div>
    </div>
  );
};

export default SearchResults;
