// src/pages/Home.js
import React from 'react';
import CategoryList from '../pages/CategoryList';
import SearchComponent from '../components/SearchComponent';
import ItemList from '../pages/ItemList';

const Home = () => {

  return (
    <div className="container">
      <span className="titulo-home h1" style={{fontSize:'28px'}}>Bebilogo</span><br/>
      <span className="subtitulo-home p">Rua Capanema 5, Marambaia, Belém/PA</span>
      <SearchComponent />
      <CategoryList />
      <ItemList />
    </div>
  );
};

export default Home;
