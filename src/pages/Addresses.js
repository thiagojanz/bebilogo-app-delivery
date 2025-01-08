import React, { useEffect, useState, useCallback  } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { FaMapMarkerAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Switch, Modal, message, Flex, Spin, Card, Button } from 'antd';
import AddressForm from '../components/AddressForm'; // Import the AddressForm component
import { LoadingOutlined } from '@ant-design/icons';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewAddressModalVisible, setIsNewAddressModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      setError('Usuário não encontrado.');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(`${Api_VariavelGlobal}/api/enderecos/${userId}`);
  
      if (response.data && response.data.enderecos) {
        const fetchedAddresses = response.data.enderecos.sort((a, b) => b.ID_ENDERECO - a.ID_ENDERECO);
        setAddresses(fetchedAddresses);
  
        const activeAddress = fetchedAddresses.find(address => address.STATUS === 1);
        if (activeAddress) {
          setSelectedAddressId(activeAddress.ID_ENDERECO);
        }
      } else {
        setError('Formato de dados inesperado.');
      }
    } catch (err) {
      setError('Erro ao buscar endereços.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Inclua fetchAddresses no array de dependências
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSwitchChange = async (checked, addressId) => {
    if (!checked) return; // Prevent deactivating the selected address

    const userId = localStorage.getItem('userId');
    setSelectedAddressId(addressId);

    try {
      setLoading(true);
      await axios.put(`${Api_VariavelGlobal}/api/enderecos/${userId}/${addressId}`, { ativo: checked });

      setAddresses(prevAddresses =>
        prevAddresses.map(address =>
          address.ID_ENDERECO === addressId
            ? { ...address, STATUS: 1 }
            : { ...address, STATUS: 0 }
        )
      );
    } catch (error) {
      setError('Erro ao atualizar o endereço.');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = (addressId) => {
    setAddressToDelete(addressId);
    setIsModalVisible(true);
  };

  const handleDeleteAddress = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !addressToDelete) {
      message.error('Usuário ou endereço não encontrado.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`${Api_VariavelGlobal}/api/enderecos/${userId}/${addressToDelete}`);
      if (response.data.success) {
        message.success('Endereço excluído com sucesso!');
        setIsModalVisible(false);
        fetchAddresses();
      } else {
        message.error(response.data.message || 'Erro ao excluir o endereço!');
      }
    } catch (error) {
      message.error('Erro ao excluir o endereço!');
      console.error('Erro ao deletar endereço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const openNewAddressModal = () => {
    setIsNewAddressModalVisible(true);
  };

  const closeNewAddressModal = () => {
    setIsNewAddressModalVisible(false);
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="loading-screen-orders loading-screen">
        <Flex className="loading-icon-screen" align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div>
    );
  }

  return (
    <div>
      <h3 className="bottom10"><FaMapMarkerAlt /> Meu(s) Endereço(s)</h3>
      <Button onClick={openNewAddressModal}><FaPlus /> Novo Endereço</Button>

      {error && <p>{error}</p>}
      {addresses.length > 0 ? (
        <>
          {addresses.map(address => (
            <div className="orders-card" key={address.ID_ENDERECO}>
              <Card bordered={false} style={{ width: '100%' }}>
                <div style={{ display: 'flow-root' }}>
                  <div className="button-trash-address">
                    <FaTrash
                      onClick={() => showDeleteModal(address.ID_ENDERECO)}
                      size={20}
                      style={{
                        color: selectedAddressId === address.ID_ENDERECO ? 'gray' : 'red',
                        pointerEvents: selectedAddressId === address.ID_ENDERECO ? 'none' : 'auto'
                      }}
                    />
                  </div>
                  <div className="button-switch-address">
                    <Switch
                      checked={selectedAddressId === address.ID_ENDERECO}
                      onChange={(checked) => handleSwitchChange(checked, address.ID_ENDERECO)}
                    />
                  </div>
                </div>
                <p className="item-name">{address.ENDERECO}, {address.NUMERO} | {address.BAIRRO}</p>
                <p>{address.COMPLEMENTO}</p>
                <p>{address.CIDADE}/{address.UF}</p>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <p>Nenhum endereço encontrado.</p>
      )}

      <Modal
        title="Confirmar Exclusão"
        open={isModalVisible}
        onOk={handleDeleteAddress}
        onCancel={handleCancel}
        okText="Excluir"
        cancelText="Cancelar"
      >
        <p>Tem certeza de que deseja excluir este endereço?</p>
      </Modal>

      <Modal open={isNewAddressModalVisible} onCancel={closeNewAddressModal} footer={null}>
        <AddressForm onClose={closeNewAddressModal} />
      </Modal>
    </div>
  );
};

export default Addresses;
