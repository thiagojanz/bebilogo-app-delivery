import React, { useEffect, useState } from 'react';
import { FaTag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import { Tag, Space, Spin, Flex, Button, Rate, notification } from 'antd';
import { useCart } from '../CartContext'; 
import { LoadingOutlined } from '@ant-design/icons';
import '../global.css'; // Para estilos

const ItemList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedTag, setSelectedTag] = useState(null);
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
        setCategories(categoriesData);
  
        // Inicializar a primeira categoria como selecionada
        if (categoriesData.length > 0) {
          setSelectedTag(categoriesData[0].CATEGORIA);
        }
  
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
    if (!selectedTag) return true;
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
    // Exibe a notificação
    notification.success({
      message: 'Produto adicionado ao carrinho!',
      placement: 'topRight', // Localização: canto superior direito
      duration: 3, // Tempo de exibição: 3 segundos
      style: {
        backgroundColor: '#d4edda', // Verde claro
        borderColor: '#c3e6cb',
        color: '#155724',
      },
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
      <h2 className="titulo-home">Cardápio</h2>
      <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <Space 
  size="size" 
  wrap={false}  // Desabilita o wrap para garantir alinhamento horizontal
  style={{
    paddingBottom: '15px', 
    overflowX: 'auto',        // Habilita o scroll horizontal
    whiteSpace: 'nowrap',      // Impede o quebra de linha
    display: 'flex',
  }}
>
  {categories.map((category) => (
    <Tag.CheckableTag
      key={category.CATEGORIA}
      checked={selectedTag === category.CATEGORIA}
      onChange={() => handleChange(category.CATEGORIA)}
      style={{ marginRight: '10px', display: 'inline-block', fontSize: '15px', }}  // Garante que cada tag esteja no mesmo eixo horizontal
    >
      {category.CATEGORIA}
    </Tag.CheckableTag>
  ))}
</Space>

</div>
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
                      <Button className="buy-button" onClick={() => handleBuy(product)}>Comprar</Button>
                      <Button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>Adicionar ao Carrinho</Button>
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
            <span className='pagination-info'> {currentPage} de {totalPages} </span>
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
