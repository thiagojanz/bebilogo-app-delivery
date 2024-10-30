import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';

const ItemList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${Api_VariavelGlobal}/api/produtos`, {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    })
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="Itens-section">
      <h2 className="titulo-home">Produtos</h2>
      <div className="items-list">
        {currentItems.map((product) => (
          <Link className='text-decoration' to={`/product/${product.ID_PRODUTO}`}>
          <div key={product.ID_PRODUTO} className="item-card">
            {product.imageUrl ? (
                <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} alt={product.PRODUTO} className="item-image" />
              
            ) : (
              <p>Imagem não disponível</p>
            )}
            <div className="item-info">
              <h3 className="item-name">{product.PRODUTO}</h3>
              <p className="item-current-price">R$ {product.PRECO_ATUAL.toFixed(2)}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button className='pagination-button' onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Anterior
        </button>
        <button className='pagination-button' onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Próximo
        </button>
      </div>
    </div>
  );
};

export default ItemList;
