// src/components/SplashScreen.js
import React, { useEffect } from 'react';
import './SplashScreen.css'; // Para estilos
import logo from '../img/logomarca_app_white.png'; // Ajuste para o caminho correto da sua logomarca
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Chama a função quando o tempo acabar
    }, 3000); // Tempo em milissegundos (3 segundos)

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <img src={logo} alt="Logo" /> {/* Use a logomarca importada */}
      <div className="loading-screen">
        <Flex className="loading-icon-screen" align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div>
    </div>
  );
};

export default SplashScreen;
