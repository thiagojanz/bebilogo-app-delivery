import React, { useEffect, useState } from 'react';
import { FaCubes, FaTag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import { Tag, Space, Spin, Flex, Button, Rate } from 'antd';
import { useCart } from '../CartContext'; 
import { LoadingOutlined } from '@ant-design/icons';

const ItemList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [value, setValue] = useState(5);

  // Gerenciamento de quantidade por produto
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchUrl = searchQuery
          ? `${Api_VariavelGlobal}/api/produtos/?search=${searchQuery}`
          : `${Api_VariavelGlobal}/api/produtos`;

        const productsResponse = await fetch(searchUrl, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const categoriesResponse = await fetch(`${Api_VariavelGlobal}/api/categorias`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const categoriesData = await categoriesResponse.json();
        setCategories([{ CATEGORIA: 'Todos', ID_CATEGORIA: null }, ...categoriesData]);

        // Inicializar as quantidades com 1 para cada produto
        const initialQuantities = {};
        productsData.forEach(product => {
          initialQuantities[product.ID_PRODUTO] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleChange = (category) => {
    setSelectedTag(category);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    if (selectedTag === 'Todos') return true;
    const productCategory = categories.find(category => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA));
    return productCategory && selectedTag === productCategory.CATEGORIA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
    navigate('/checkout', { state: { totalAmount: product.PRECO_ATUAL * (quantities[product.ID_PRODUTO] || 1), isOpen: true } });
  };

  const increaseQuantity = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const desc = ['Muito Ruim', 'Ruim', 'normal', 'Bom', 'Excelente'];

  return (
    <div className="Itens-section">
      <h2 className="titulo-home"><FaCubes /> Todos os Produtos</h2>

      {/* Filtro de categorias */}
      <Space size="small" wrap>
        {categories.map((category) => (
          <Tag.CheckableTag
            key={category.CATEGORIA}
            checked={selectedTag === category.CATEGORIA}
            onChange={() => handleChange(category.CATEGORIA)}
          >
            {category.CATEGORIA}
          </Tag.CheckableTag>
        ))}
      </Space>

      {/* Exibição de loading enquanto os dados são carregados */}
      {loading ? (
        <div className="loading-screen-orders loading-screen">
          <Flex className='loading-icon-screen' align="center">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        </div>
      ) : (
        <>
          <div className="items-list">
            {currentItems.map((product) => {
              const productCategory = categories.find(category => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA));
              return (
                <div className="item-card" key={product.ID_PRODUTO}>
                  {product.imageUrl ? (
                    <Link to={`/product/${product.ID_PRODUTO}`} className='text-decoration'>
                      <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} alt={product.PRODUTO} className="item-image" />
                    </Link>
                  ) : (
                    <p>Imagem não disponível</p>
                  )}
                  <div className="item-info">
                    <h4 className="item-name">{product.PRODUTO}</h4>
                    <div className="item-category">
                      <FaTag /> {productCategory ? productCategory.CATEGORIA : 'Categoria não encontrada'}
                    </div>
                    {/* Preço atual e total multiplicado pela quantidade */}
                    <div className='flex'>
                    <div className="item-current-price">
                      <div><b>R$ {(product.PRECO_ATUAL * (quantities[product.ID_PRODUTO] || 1)).toFixed(2)}</b></div>
                      <Flex gap="middle" vertical>
                        <Rate tooltips={desc} onChange={setValue} value={value} />
                      </Flex>
                    </div>
                    
                    {/* Controle de quantidade */}
                    <div className="quantity-control">
                      <button onClick={() => decreaseQuantity(product.ID_PRODUTO)}>-</button>
                      <span>{quantities[product.ID_PRODUTO]}</span>
                      <button onClick={() => increaseQuantity(product.ID_PRODUTO)}>+</button>
                    </div>
                    </div>

                    <div className="">
                      <Button className="buy-button-2" onClick={() => handleBuy(product)}>Comprar</Button>
                      <Button className="add-to-cart-button-2" onClick={() => handleAddToCart(product)}>Adicionar ao Carrinho</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controles de paginação */}
          <div className="pagination">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span> {currentPage} de {totalPages} </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemList;
