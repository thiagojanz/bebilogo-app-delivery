import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { FaMapMarkerAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Switch, Modal, message, Flex, Spin, Card, Button } from 'antd';
import AddressForm from '../components/AddressForm';  // Import the AddressForm component
import { LoadingOutlined } from '@ant-design/icons';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewAddressModalVisible, setIsNewAddressModalVisible] = useState(false); // State for new address modal
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch addresses function
  const fetchAddresses = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      setError('Usuário não encontrado.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${Api_VariavelGlobal}/api/enderecos/${userId}`);
      
      if (response.data && response.data.enderecos) {
        // Sort addresses by descending ID_ENDERECO
        const fetchedAddresses = response.data.enderecos.sort((a, b) => b.ID_ENDERECO - a.ID_ENDERECO);
        setAddresses(fetchedAddresses);

        // Set the address with STATUS = 1 as selected initially
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
  };

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSwitchChange = async (checked, addressId) => {
    const userId = localStorage.getItem('userId');
    setSelectedAddressId(checked ? addressId : null);

    try {
      setLoading(true);
      await axios.put(`${Api_VariavelGlobal}/api/enderecos/${userId}/${addressId}`, {
        ativo: checked, // Field to update the status in the database
      });

      // Update the STATUS of local addresses to reflect the change
      setAddresses(prevAddresses =>
        prevAddresses.map(address =>
          address.ID_ENDERECO === addressId
            ? { ...address, STATUS: checked ? 1 : 0 }
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
    setAddressToDelete(addressId); // Set the address to delete
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
      // Delete the most recent address related to the same user
      const response = await axios.delete(`${Api_VariavelGlobal}/api/enderecos/${userId}/${addressToDelete}`);
      
      if (response.data.success) {
        message.success('Endereço excluído com sucesso!');
        setIsModalVisible(false);
        fetchAddresses(); // Re-fetch the updated list of addresses
      } else {
        message.error(response.data.message || 'Erro ao excluir o endereço!');
      }
    } catch (error) {
      message.error('Erro ao excluir o endereço!');
      console.error("Erro ao deletar endereço:", error);
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
    fetchAddresses(); // Re-fetch the addresses after adding a new one
  };

  if (loading) {
    return (
      <div className="loading-screen-orders loading-screen">
        <Flex className='loading-icon-screen' align="center">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
      </div>
    );
  }

  return (
    <div>
      <h3 className='bottom10'><FaMapMarkerAlt /> Meu(s) Endereço(s)</h3>
      <Button onClick={openNewAddressModal}><FaPlus /> Novo Endereço</Button>

      {error && <p>{error}</p>}
      {addresses.length > 0 ? (
        <>
          {addresses.map(address => (
            <div className='orders-card' key={address.ID_ENDERECO}>
              <Card bordered={false} style={{ width:'100%' }}>
                <div style={{display:'flow-root'}}>
                  <div className='button-trash-address'>
                    <FaTrash onClick={() => showDeleteModal(address.ID_ENDERECO)} size={20}/>
                  </div>
                  <div className='button-switch-address'>
                    <Switch checked={selectedAddressId === address.ID_ENDERECO} onChange={(checked) => handleSwitchChange(checked, address.ID_ENDERECO)}/>
                  </div>
                </div>
                <p className="item-name">{address.ENDERECO},{address.NUMERO} | {address.BAIRRO}</p>
                <p>{address.COMPLEMENTO}</p>
                <p>{address.CIDADE}/{address.UF}</p>
              </Card>
            </div>
          ))}
        </>
      ) : (
        <p>Nenhum endereço encontrado.</p>
      )}

      {/* Modal for deleting address */}
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

      {/* Modal for adding new address */}
      <Modal 
        open={isNewAddressModalVisible} 
        onCancel={closeNewAddressModal} 
        footer={null}
      >
        <AddressForm onClose={closeNewAddressModal} />
      </Modal>
    </div>
  );
};

export default Addresses;
