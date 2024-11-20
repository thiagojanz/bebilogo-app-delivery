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
      <h1 className="titulo-home center">Buscar</h1>
      <SearchResults /> 
    </div>
  );
};

export default Search;
