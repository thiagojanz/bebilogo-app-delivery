import React from 'react';
import ToAccompany from './ToAccompany';
import { Link, useNavigate  } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

const AcompanharPedidos = () => {
    const navigate = useNavigate(); // Hook para manipular o histórico de navegação
  return (
    <div className="container">
        <div className="left-arrow">
          <Link className="secondary"  onClick={() => navigate(-1)}><FaArrowLeft /></Link>
        </div>
        <div className="center" style={{marginTop:60}}>
        <ToAccompany />
        </div>
      </div>
  );
};

export default AcompanharPedidos;
