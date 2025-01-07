// src/pages/Home.js
import React from 'react';
import CategoryList from '../pages/CategoryList';
import SearchComponent from '../components/SearchComponent';

const Home = () => {

  return (
    <div className="container">
      <h1 className="titulo-home">Seja Bem Vindo!</h1>
      <SearchComponent />
      <CategoryList />
    </div>
  );
};

export default Home;
