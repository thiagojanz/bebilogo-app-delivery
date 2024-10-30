import React, { useEffect, useState } from 'react';
import { Api_VariavelGlobal } from '../global';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${Api_VariavelGlobal}/api/categorias/status`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Erro ao buscar categorias:', error));
  }, []);

  return (
    <div className="Categorias-section">
      <h2 className="titulo-home">Categorias</h2>
      <div className="Categorias-list">
        {categories.map((item) => (
          <div key={item.ID_CATEGORIA} className="Categorias-item">
            <img src={`https://bebilogo.com.br/uploads_categorias/${item.IMAGEM}`} alt={item.CATEGORIA} />
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
