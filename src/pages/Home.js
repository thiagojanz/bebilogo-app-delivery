// src/pages/Home.js
import React from 'react';
import CategoryList from '../pages/CategoryList';
import SearchComponent from '../components/SearchComponent';
import ItemList from '../pages/ItemList';

const Home = () => {
  return (
    <div className="container">
      <div className="flex" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo em formato de círculo */}
        <div
          className="logo-container"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'black',
            backgroundImage: 'url(/logo_circle.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginRight: '10px',
          }}
        ></div>

        {/* Título e subtítulo */}
        <div>
          <span className="titulo-home h1" style={{ fontSize: '28px' }}>Bebilogo</span><br />
          <span className="subtitulo-home p">Rua Capanema 5, Marambaia, Belém/PA</span>
        </div>
      </div>

      {/* Outros componentes */}
      <div>
        <SearchComponent />
        <CategoryList />
        <ItemList />
      </div>
    </div>
  );
};

export default Home;
