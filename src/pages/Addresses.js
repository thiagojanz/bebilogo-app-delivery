// src/pages/Addresses.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = localStorage.getItem('userId'); // Certifique-se de que o ID está armazenado corretamente
      
      if (!userId) {
        setError('Usuário não encontrado.');
        return;
      }

      try {
        const response = await axios.get(`${Api_VariavelGlobal}/api/enderecos/${userId}`);
        
        // Agora você deve acessar 'enderecos' dentro do objeto retornado
        if (response.data && response.data.enderecos) {
          setAddresses(response.data.enderecos); // Define os endereços a partir da chave 'enderecos'
        } else {
          setError('Formato de dados inesperado.');
        }
      } catch (err) {
        setError('Erro ao buscar endereços.');
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <h4>Meus Endereços</h4>
      {error && <p>{error}</p>}
      {addresses.length > 0 ? (
        <>
          {addresses.map(address => (
            <div className='item-card' key={address.ID_ENDERECO}>
              <div className="item-info">
                <h3 className="item-name">{address.ENDERECO} {address.NUMERO}</h3>
                <p>{address.CIDADE}/{address.UF}</p>
              </div>
            </div>
                       
          ))}
        </>
      ) : (
        <p>Nenhum endereço encontrado.</p>
      )}
    </div>
  );
};

export default Addresses;
