import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import { Spin, Button, Flex, Rate } from 'antd';
import { FaArrowLeft, FaTag } from 'react-icons/fa';
import { LoadingOutlined } from '@ant-design/icons';
import { useCart } from '../CartContext';

const ProductsByBrand = () => {
  const { brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [value, setValue] = useState(5);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const itemsPerPage = 3; // Itens por página
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Requisição para produtos com paginação
        const productsResponse = await fetch(
          `${Api_VariavelGlobal}/api/produtos/marca/${brandId}?page=${currentPage}&limit=${itemsPerPage}`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        const productsData = await productsResponse.json();

        // Requisição para categorias
        const categoriesResponse = await fetch(
          `${Api_VariavelGlobal}/api/categorias`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        const categoriesData = await categoriesResponse.json();

        setCategories([{ CATEGORIA: 'Todos', ID_CATEGORIA: null }, ...categoriesData]);

        // Verificando se a resposta contém os dados dos produtos
        if (productsData && productsData.products) {
          setProducts(productsData.products);
          setTotalPages(Math.ceil(productsData.totalProducts / itemsPerPage)); // Calculando total de páginas
        } else {
          setProducts([]); // Nenhum produto encontrado
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setProducts([]); // Caso haja erro, limpa os produtos
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandId, currentPage]); // Dependências: quando brandId ou currentPage mudar, refaz a requisição

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
        isOpen: true
      }
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

  if (loading) {
    return (
      <div className="loading-screen-orders loading-screen">
        <Flex className="loading-icon-screen" align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container">
        <div className="left-arrow">
          <Link className="secondary" to="/"><FaArrowLeft /></Link>
        </div>
        <h2 className="titulo-home">Produtos da Marca</h2>
        <div className="items-list">
          <p>Nenhum produto encontrado para esta marca.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="left-arrow">
        <Link className="secondary" to="/"><FaArrowLeft /></Link>
      </div>
      <h2 className="titulo-home">Produtos por Marca</h2>

      <div className="items-list">
        {products.map((product) => {
          const productCategory = categories.find(
            (category) => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA)
          );

          return (
            <div className="item-card" key={product.ID_PRODUTO}>
              {product.imageUrl ? (
                <Link to={`/product/${product.ID_PRODUTO}`} className="text-decoration">
                  <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} alt={product.PRODUTO} className="item-image" />
                </Link>
              ) : (
                <p>No Image</p>
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
                  <Button className="buy-button-2" onClick={() => handleBuy(product)}>Comprar</Button>
                  <Button className="add-to-cart-button-2" onClick={() => handleAddToCart(product)}>Adicionar ao Carrinho</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        <span>{currentPage} de {totalPages}</span>

        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>

      <div className="continue-shopping center">
        <Link to="/">Continuar comprando</Link>
      </div>
    </div>
  );
};

export default ProductsByBrand;
