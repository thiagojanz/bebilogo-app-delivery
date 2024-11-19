import React, { useEffect, useState } from 'react';
import { Api_VariavelGlobal } from '../global';
import { Flex, Spin } from 'antd';
import { Link } from 'react-router-dom';  // Importar Link do react-router-dom
import { LoadingOutlined } from '@ant-design/icons';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para embaralhar o array de marcas
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    fetch(`${Api_VariavelGlobal}/api/marcas/status`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(data => {
        const shuffledBrands = shuffleArray(data); // Embaralha as marcas
        setBrands(shuffledBrands);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar marcas:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return (
    <div className="Marcas-section loading-screen">
      <h2 className="titulo-home-marcas">Marcas</h2>
      <Flex className='loading-icon-screen' align="center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    </div>
  );

  return (
    <div className="Marcas-section">
      <h2 className="titulo-home-marcas">Marcas</h2>
      <div className="Marcas-list">
        {brands.map((item) => (
          <Link key={item.ID_MARCA} to={`/produtos/marca/${item.ID_MARCA}`} className="Marcas-item">
            <img src={`https://bebilogo.com.br/uploads_marcas/${item.IMAGEM}`} alt={item.MARCA} />
            <div>
              <span>{item.MARCA}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
