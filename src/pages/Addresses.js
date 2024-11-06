// src/pages/Addresses.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { FaMapMarkerAlt, FaRegTrashAlt } from "react-icons/fa";
import { Switch } from 'antd';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('Usuário não encontrado.');
        return;
      }

      try {
        const response = await axios.get(`${Api_VariavelGlobal}/api/enderecos/${userId}`);
        
        if (response.data && response.data.enderecos) {
          const fetchedAddresses = response.data.enderecos;
          setAddresses(fetchedAddresses);

          // Define o endereço com STATUS = 1 como selecionado inicialmente
          const activeAddress = fetchedAddresses.find(address => address.STATUS === 1);
          if (activeAddress) {
            setSelectedAddressId(activeAddress.ID_ENDERECO);
          }
        } else {
          setError('Formato de dados inesperado.');
        }
      } catch (err) {
        setError('Erro ao buscar endereços.');
      }
    };

    fetchAddresses();
  }, []);

  const handleSwitchChange = async (checked, addressId) => {
    const userId = localStorage.getItem('userId');
    setSelectedAddressId(checked ? addressId : null);

    try {
      await axios.put(`${Api_VariavelGlobal}/api/enderecos/${userId}/${addressId}`, {
        ativo: checked, // Campo para atualizar o status no banco
      });

      // Atualiza o STATUS dos endereços locais para refletir a alteração
      setAddresses(prevAddresses =>
        prevAddresses.map(address =>
          address.ID_ENDERECO === addressId
            ? { ...address, STATUS: checked ? 1 : 0 }
            : { ...address, STATUS: 0 }
        )
      );
    } catch (error) {
      setError('Erro ao atualizar o endereço.');
    }
  };

  return (
    <div>
      <h3><FaMapMarkerAlt /> Meus Endereços</h3>
      {error && <p>{error}</p>}
      {addresses.length > 0 ? (
        <>
          {addresses.map(address => (
            <div className='addresses-card' key={address.ID_ENDERECO}>
              <div className="item-info">
                <div className='button-trash-address'><FaRegTrashAlt /></div>
                <h3 className="item-name">{address.ENDERECO} {address.NUMERO}</h3>
                <div>
                  <div>{address.CIDADE}/{address.UF}</div>
                  <div className='button-switch-address'>
                    <Switch
                      checked={selectedAddressId === address.ID_ENDERECO}
                      onChange={(checked) => handleSwitchChange(checked, address.ID_ENDERECO)}
                    />
                  </div>
                </div>
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
