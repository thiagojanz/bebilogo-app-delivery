// src/pages/Home.js
import React from 'react';
import ItemList from '../pages/ItemList';
import BrandList from '../pages/BrandList';
import CategoryList from '../pages/CategoryList';

const Home = () => {

  return (
    <div className="container">
      <h1 className="titulo-home">Thiago Janz</h1>
      <span className="subtitulo-home">thiagojanz@hotmail.com</span>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Buscar produtos..." />
      </div>

      <BrandList />

      <CategoryList />

      <ItemList />

    </div>
  );
};

export default Home;
