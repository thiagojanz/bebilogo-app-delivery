import React, { useEffect, useState } from 'react';
import MD5 from 'crypto-js/md5';

const generateRandomToken = () => {
  // Gera um número aleatório entre 1 e 99999
  const randomNumber = Math.floor(Math.random() * (99999 - 1 + 1)) + 1;

  // Gera o hash MD5 do número aleatório
  const token = MD5(randomNumber.toString()).toString();

  return token;
};

const Tkcomponent = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    // Gera o token assim que o componente é montado
    const generatedToken = generateRandomToken();
    setToken(generatedToken);
  }, []); // Dependência vazia significa que isso só roda uma vez quando o componente é montado

  return (
    <div>
      <h1>Token Gerado:</h1>
      <p>{token}</p>
    </div>
  );
};

export default Tkcomponent;
