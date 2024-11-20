// src/pages/Home.js
import React from 'react';
import BrandList from '../pages/BrandList';
import CategoryList from '../pages/CategoryList';
import SearchComponent from '../components/SearchComponent';

const Home = () => {

  return (
    <div className="container">
      <h1 className="titulo-home">Thiago Janz</h1>
      <SearchComponent />
      <CategoryList />
      <BrandList />
    </div>
  );
};

export default Home;
