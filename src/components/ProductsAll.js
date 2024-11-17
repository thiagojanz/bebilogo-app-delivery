import React from 'react';
import ItemList from '../pages/ItemList';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const ProductsAll = () => {

  return (
    <div className="container texto-home">
      <div className="left-arrow">
      <Link className="secondary" to='/'><FaArrowLeft /></Link>
      </div>
      <ItemList />      
    </div>
  );
};

export default ProductsAll;
