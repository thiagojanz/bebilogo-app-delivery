// src/pages/Search.js
import React from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

const Search = () => {
  return (
    <div className="container texto-home">
    <h1 className="titulo-home"><FaSearch /> Buscar</h1>
    <div className="search-container">
      <input type="text" className="search-input" placeholder="Buscar produtos..." />
      
      <button className="filter-button">
        <i className="fas fa-filter"></i> {<FaFilter />}
      </button>
    </div>
    <p className="texto-home">Este é o melhor lugar para pedir suas bebidas favoritas!</p>
  </div>
  );
};

export default Search;
