import React, { useState, useEffect, useCallback } from 'react';
import { FaUserClock, FaRegUser, FaUserPlus, FaPen } from 'react-icons/fa';
import { Button, Space, Modal, message } from 'antd';
import { Api_VariavelGlobal } from '../global';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const SectionClient = ({ onFreteUpdate }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showNewLogin, setShowNewLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [frete, setFrete] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para atualizar o valor do frete
  const atualizarFrete = useCallback((novoFrete) => {
    setFrete(novoFrete);
    if (onFreteUpdate) {
      onFreteUpdate(novoFrete); // Notifica o componente pai, se necessário
    }
  }, [onFreteUpdate]);

  // Fetch user address and freight based on neighborhood
  const fetchUserAddress = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      try {
        const addressResponse = await axios.get(`${Api_VariavelGlobal}/api/enderecos/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filtra o endereço com STATUS = 1
        const activeAddress = addressResponse.data.enderecos.find(addr => addr.STATUS === 1);
        if (activeAddress) {
          setUserAddress(activeAddress);

          // Fetch freight based on neighborhood (BAIRRO)
          const freteResponse = await axios.get(`${Api_VariavelGlobal}/api/frete/${activeAddress.BAIRRO}`);
          if (freteResponse.data && freteResponse.data.KM) {
            atualizarFrete(freteResponse.data.KM);
          } else {
            atualizarFrete('Frete não encontrado');
          }
        } else {
          setUserAddress(null);
        }
      } catch (error) {
        console.error('Erro ao buscar endereço e frete:', error);
        message.error('Erro ao carregar o endereço e frete.');
      }
    }
  }, [atualizarFrete]);

  // Fetch user data and address when authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setIsAuthenticated(true);
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`${Api_VariavelGlobal}/api/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(userResponse.data);
          fetchUserAddress();
        } catch (error) {
          message.error('Erro ao carregar os dados do usuário.');
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };
      fetchUserData();
    }
  }, [fetchUserAddress]);

  // Store neighborhood in sessionStorage when address is loaded
  useEffect(() => {
    if (userAddress) {
      sessionStorage.setItem('bairro', userAddress.BAIRRO);
    }
  }, [userAddress]);

  const handleClose = () => {
    setTimeout(() => navigate('/profile'), 300);
  };

  return (
    <div className="">
      <h3><FaUserClock /> Dados do Cliente</h3>
      <p className="subtitulo-home">Este pedido será entregue a:</p>
      <div className="radio-list">
        {isAuthenticated ? (
          <div className="">
            {userData && (
              <div className="subtitulo-home">
                <p><b>{userData.LOGIN}</b><br/>
                {userData.TELEFONE}</p>
              </div>
            )}
            {userAddress ? (
              <div className="subtitulo-home">
                <p><b>Endereço:</b> {userAddress.ENDERECO} {userAddress.NUMERO}<br/>
                {userAddress.COMPLEMENTO} {userAddress.CIDADE}/{userAddress.UF} <FaPen className='default' onClick={handleClose}/></p>
              </div>
            ) : (
              <div className="subtitulo-home">
                <p>Endereço não encontrado...</p>
              </div>
            )}
            <div className="subtitulo-home">
              <p><b>Frete:</b> {frete}</p>
            </div>
          </div>
        ) : (
          <>
            <p>Cliente não identificado, favor identificar-se!!!</p>
            <Space>
              <Button size="large" onClick={() => setShowLogin(true)}>
                <FaRegUser /> Já sou Cliente
              </Button>
              <Button size="large" onClick={() => setShowNewLogin(true)}>
                <FaUserPlus /> Novo Cliente
              </Button>
            </Space>
          </>
        )}
      </div>

      {/* Modal de Login */}
      <Modal
        open={showLogin}
        onCancel={() => setShowLogin(false)}
        footer={null}
      >
        
      </Modal>

      {/* Modal de Novo Cliente */}
      <Modal
        title="Novo Cliente"
        open={showNewLogin}
        onCancel={() => setShowNewLogin(false)}
        footer={null}
      >
        <p>Criar novo cadastro.</p>
      </Modal>
    </div>
  );
};

export default SectionClient;