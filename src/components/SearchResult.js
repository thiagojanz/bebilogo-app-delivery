import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Api_VariavelGlobal } from '../global';
import SearchComponent from '../components/SearchComponent';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para monitorar o carregamento
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Inicia o carregamento
      try {
        const url = `${Api_VariavelGlobal}/api/produtos/search/?query=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        const data = await response.json();
        
        setProducts(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };
  
    fetchProducts();
  }, [query]);

  return (
    <div className="search-results">
      <SearchComponent />
      {query && <p>Você pesquisou por: {query}</p>}
      
      <div className="item-list">
        {isLoading ? (
          <p>Pesquisando...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <Link key={product.ID_PRODUTO} className='text-decoration' to={`/product/${product.ID_PRODUTO}`}>
              <div className="item-card">
                {product.imageUrl ? (
                  <img src={`https://bebilogo.com.br/uploads/${product.imageUrl}`} alt={product.PRODUTO} className="item-image" />
                ) : (
                  <p>Imagem não disponível</p>
                )}
                <div className="item-info">
                  <h4 className="item-name">{product.PRODUTO}</h4>
                  <p className="item-current-price">R$ {product.PRECO_ATUAL.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Nenhum produto encontrado na busca!</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
