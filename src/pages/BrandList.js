import React, { useEffect, useState } from 'react';
import { Api_VariavelGlobal } from '../global';

const BrandList = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch(`${Api_VariavelGlobal}/api/marcas/status`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(data => setBrands(data))
      .catch(error => console.error('Erro ao buscar marcas:', error));
  }, []);

  return (
    <div className="Marcas-section">
      <h2 className="titulo-home">Marcas</h2>
      <div className="Marcas-list">
        {brands.map((item) => (
          <div key={item.ID_MARCA} className="Marcas-item">
            <img src={`https://bebilogo.com.br/uploads_marcas/${item.IMAGEM}`} alt={item.MARCA} />
            <div>
              <span>{item.MARCA}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
