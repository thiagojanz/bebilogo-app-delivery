// src/pages/Home.js
import React from 'react';
import CategoryList from '../pages/CategoryList';
import SearchComponent from '../components/SearchComponent';
import ItemList from '../pages/ItemList';

const Home = () => {

  return (
    <div className="container">
      <h1 className="titulo-home">Market App</h1>
      <SearchComponent />
      <CategoryList />
      <ItemList />
    </div>
  );
};

export default Home;
