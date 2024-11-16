import React, { useEffect, useState } from 'react';
import { Api_VariavelGlobal } from '../global';
import { Flex, Spin } from 'antd';
import { useNavigate } from 'react-router-dom'; // Usando useNavigate

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    fetch(`${Api_VariavelGlobal}/api/categorias/status`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
        setIsLoading(false);
      });
  }, []);

  const handleCategoryClick = (ID_CATEGORIA) => {
    // Navega para a página de produtos dessa categoria
    navigate(`/produtos/categoria/${ID_CATEGORIA}`);
  };

  if (isLoading) return (
    <div className="Categorias-section loading-screen-category">
      <h2 className="titulo-home-categorias">Categorias</h2>
      <Flex className='loading-icon-screen-category' align="center">
        <Spin size="large" />
      </Flex>
    </div>
  );

  return (
    <div className="Categorias-section">
      <h2 className="titulo-home-categorias">Categorias</h2>
      <div className="Categorias-list">
        {categories.map((item) => (
          <div
            key={item.ID_CATEGORIA}
            className="Categorias-item"
            onClick={() => handleCategoryClick(item.ID_CATEGORIA)} // Adiciona o clique
          >
            <img className="Categorias-item-img" src={`https://bebilogo.com.br/uploads_categorias/${item.IMAGEM}`} alt={item.CATEGORIA} />
            <div>
              <span>{item.CATEGORIA}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
