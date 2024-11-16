import React from 'react';
import { FaSearch } from 'react-icons/fa';
import SearchResults from '../components/SearchResult';
import { Link } from 'react-router-dom';

const Search = () => {

  return (
    <div className="container texto-home">
      <h1 className="titulo-home"><FaSearch /> Buscar</h1>
      <SearchResults /> 

      <div className='center'>
        <Link to='/ProductsAll' className="continue-shopping">
          Listar Todos os Produtos
        </Link>
      </div>
    </div>
  );
};

export default Search;
