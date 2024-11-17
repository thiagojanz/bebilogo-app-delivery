import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import SearchResults from '../components/SearchResult';
import { Link } from 'react-router-dom';

const Search = () => {

  return (
    <div className="container">
      <div className="left-arrow">
      <Link className="secondary" to='/'><FaArrowLeft /></Link>
      </div>
      <h1 className="titulo-home">Buscar</h1>
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
