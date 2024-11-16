import React, { useEffect, useState } from 'react';
import { FaTag, FaCubes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import { Tag, Space, Spin, Flex } from 'antd';

const ItemList = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedTag, setSelectedTag] = useState('Todos');
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const handleChange = (category) => {
    setSelectedTag(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ativar o estado de carregamento
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
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false); // Desativar o estado de carregamento
      }
    };

    fetchData();
  }, [searchQuery]);

  const filteredProducts = products.filter(product => {
    if (selectedTag === 'Todos') return true;
    const productCategory = categories.find(category => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA));
    return productCategory && selectedTag === productCategory.CATEGORIA;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="Itens-section">
      <h2 className="titulo-home"><FaCubes /> Todos os Produtos</h2>

      {/* Filtro de categorias */}
      <Space size="small" wrap>
        {categories.map((category) => (
          <>          
            <Tag.CheckableTag
              key={category.CATEGORIA}
              checked={selectedTag === category.CATEGORIA}
              onChange={() => handleChange(category.CATEGORIA)}
            >
              {category.CATEGORIA}
            </Tag.CheckableTag>
          </>
        ))}
      </Space>

      {/* Exibição de loading enquanto os dados são carregados */}
      {loading ? (
        <div className="loading-screen-orders loading-screen">
          <Flex className='loading-icon-screen' align="center">
            <Spin size="large" />
          </Flex>
        </div>
      ) : (
        <>
          {/* Exibição dos produtos */}
          <div className="items-list">
            {currentItems.map((product) => {
              const productCategory = categories.find(category => String(category.ID_CATEGORIA) === String(product.ID_CATEGORIA));
              return (
                <Link key={product.ID_PRODUTO} className='text-decoration' to={`/product/${product.ID_PRODUTO}`}>
                  <div className="item-card">
                    {product.imageUrl ? (
                      <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} alt={product.PRODUTO} className="item-image" />
                    ) : (
                      <p>Imagem não disponível</p>
                    )}
                    <div className="item-info">
                      <h4 className="item-name">{product.PRODUTO}</h4>
                      <p className="item-category">
                        <FaTag /> {productCategory ? productCategory.CATEGORIA : 'Categoria não encontrada'}
                      </p>
                      <p className="item-current-price">R$ {product.PRECO_ATUAL.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Controles de paginação */}
          <div className="pagination">
            <button 
              className='pagination-button' 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className='pagination-info'>{`${currentPage} de ${totalPages}`}</span>
            <button 
              className='pagination-button' 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemList;
