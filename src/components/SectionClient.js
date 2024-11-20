import React, { useState, useEffect, useCallback } from 'react';
import { FaUserClock, FaRegUser, FaUserPlus, FaPen, FaUserCheck } from 'react-icons/fa';
import { Button, Space, Modal, message, Input, Form, Flex, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Api_VariavelGlobal } from '../global';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import ClientForm from './ClientForm';

const SectionClient = ({ onFreteUpdate }) => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showNewLogin, setShowNewLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [frete, setFrete] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Verifica se existe um token no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(); // Busca os dados do usuário
    }
  }, []);

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Obtém o token
    if (userId) {
      try {
        const response = await axios.get(`${Api_VariavelGlobal}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        });
        setUserData(response.data);
      } catch (error) {
        message.error('Erro ao carregar os dados do usuário.');
        } finally {
          setLoading(false);
        }
    }
  };  

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
    setShowLogin(false);
    navigate(0);
  };

  const handleLogin = async (values) => {
    const hashedPassword = CryptoJS.MD5(values.SENHALOGIN).toString();
    try {
      setLoading(true);
      const response = await axios.post(`${Api_VariavelGlobal}/api/login/`, {
        EMAIL: values.EMAIL,
        SENHA: hashedPassword,
      });
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.ID_USUARIO);
      setIsAuthenticated(true);
      message.success('Seja Bem Vindo!!!');
      
      // Fecha o modal login
      setShowLogin(false);
      
      // Exibir o modal de sucesso
      setShowSuccessModal(true);
  
      // Recarregar a página de checkout após 2 segundos
      // Redirecionar para o checkout após 2 segundos
      setTimeout(() => {
        navigate('/checkout'); // Redireciona para a página de checkout
        setShowSuccessModal(false);
      }, 4000);
  
      fetchUserData();
    } catch (error) {
      if (error.response) {
        message.error('Erro: ' + (error.response.data.message || 'Erro desconhecido'));
      } else if (error.request) {
        message.error('Erro: O servidor não respondeu.');
      } else {
        message.error('Erro: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = async () => {
    try {            
      // Redirecionar para o checkout após 2 segundos
      setTimeout(() => {
        navigate('/profile'); // Redireciona para a página de checkout
      }, 10);
  
      fetchUserData();
    } catch (error) {
      if (error.response) {
        message.error('Erro: ' + (error.response.data.message || 'Erro desconhecido'));
      } else if (error.request) {
        message.error('Erro: O servidor não respondeu.');
      } else {
        message.error('Erro: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  if (loading) {
    return <>
    <div className="loading-screen-orders loading-screen">
      <Flex className='loading-icon-screen' align="center">
        <Spin size="large" />
      </Flex>
    </div></>;
  }

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
                <p>Endereço não encontrado... <Link onClick={handleProfile}>Incluir Endereço</Link></p>
              </div>
            )}
            <div className="subtitulo-home">
              <p><b>Frete:</b> {frete}</p>
            </div>
          </div>
        ) : (
          <>
          <div className='center'>
            <p>Cliente não identificado, favor identificar-se!!!</p>
          </div>
          <div className='center'>
            <Space>
              <Button className='bottom10' onClick={() => setShowLogin(true)}>
                <FaRegUser /> Já sou Cliente
              </Button>
              <Button className='bottom10' type='primary' onClick={() => setShowNewLogin(true)}>
                <FaUserPlus /> Novo Cliente
            </Button>
            </Space>
          </div>
          </>
        )}
      </div>

      {/* Modal de Login */}
      <Modal open={showLogin} onCancel={() => setShowLogin(false)} footer={null}>
      <Form onFinish={handleLogin}>
        <div className=''>
       <h1 className="titulo-home"><FaUserCheck /> Já Sou Cliente</h1>
        <p>Seja Bem vindo !!!</p>
        <Form.Item name="EMAIL">
          <Input required type='text' size='large' placeholder='Email' />
        </Form.Item>

        <Form.Item name="SENHALOGIN">                
          <Input.Password required type='password' size='large' placeholder="Senha" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>                
        </Form.Item>

        <div className='container center'>
          <div className='flex_profile'>
          <Button type="default" size='large' htmlType="submit">Efetuar Login</Button>
          </div>
        </div> 
        </div>
        </Form>
      </Modal>

      {/* Modal de Novo Cliente */}
      <Modal open={showNewLogin} onCancel={() => setShowNewLogin(false)} footer={null}>
        <ClientForm />
      </Modal>

      {/* Modal de Sucesso */}
      <Modal
        open={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        footer={null}
        closable={false}
      >
        <h2>Login Bem-Sucedido!</h2>
        <p>Carregando seu dados...</p>
      </Modal>
    </div>
  );
};

export default SectionClient;