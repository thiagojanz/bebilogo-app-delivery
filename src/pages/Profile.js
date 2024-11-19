import React, { useState, useEffect } from 'react';
import '../global.css';
import { FaUserLock, FaUserPlus } from "react-icons/fa";
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Button, Input, message, Flex, Spin, Modal } from 'antd';
import {  Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Addresses from './Addresses';
import ClientForm from '../components/ClientForm';

const Profile = () => {
  const [userData, setUserData] = useState(null); // Para armazenar os dados do usuário
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controle de autenticação
  const [loading, setLoading] = useState(false);
  const [showNewLogin, setShowNewLogin] = useState(false);

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
        setLoading(true);
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

  const handleLogin = async (values) => {
    const hashedPassword = CryptoJS.MD5(values.SENHALOGIN).toString();

    try {
      setLoading(true);
      const response = await axios.post(`${Api_VariavelGlobal}/api/login/`, {
        EMAIL: values.EMAIL,
        SENHA: hashedPassword,
      });

      // Armazena o token e o ID do usuário no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.ID_USUARIO); // Armazenando o ID do usuário
      setIsAuthenticated(true);
      message.success('Seja Bem Vindo!!!');
      fetchUserData(); // Chama a função para buscar os dados do usuário após o login

    } catch (error) {
      if (error.response) {
        message.error('Erro: ' + (error.response.data.message || 'Erro desconhecido'));
      } else if (error.request) {
        message.error('Erro: O servidor não respondeu.');
      } else {
        message.error('Erro: ' + error.message);
      }
    } setLoading(false);
  };

  const handleLogout = () => {
    // Remove o token do localStorage ao fazer logout
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove o ID do usuário
    setIsAuthenticated(false);
    setUserData('null'); // Limpa os dados do usuário
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
    <div className='section-auth container'>
      <div className="left-arrow">
        <FaUserLock />
      </div>
      <h1 className="titulo-home"> Cliente</h1>
      {!isAuthenticated ? ( // Renderiza as seções de login e cadastro se não estiver autenticado
        <>
            <p>Efetuar Login</p>
            <Button className='bottom10' type='primary' onClick={() => setShowNewLogin(true)}>
              <FaUserPlus /> Novo Cliente
            </Button>
            <Form onFinish={handleLogin}>
              <Form.Item name="EMAIL">
                <Input required type='text' size='large' placeholder='Email' />
              </Form.Item>

              <Form.Item name="SENHALOGIN">                
                <Input.Password required type='password' size='large' placeholder="Senha"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />                
              </Form.Item>

              <div className='container center'>
                <div className='flex_profile'>
                  <Button type="default" size='large' htmlType="submit">Efetuar Login</Button>
                </div>
                <div className='center link-reset-password'>
                  <Link to='/' className="continue-shopping">
                        Esqueci a Senha
                  </Link>
                </div>
              </div>
            </Form>
          
            
          
        </>
      ) : ( // Renderiza a nova seção quando o usuário está autenticado
        <>          
          {userData && ( // Verifica se os dados do usuário estão disponíveis
            <div className="">
              <p><strong>Nome:</strong> {userData.LOGIN}</p>
              <p><strong>Email:</strong> {userData.EMAIL}</p>
              <p><strong>Telefone:</strong> {userData.TELEFONE}</p>
              <Addresses />
            </div>            
          )}
              <div className='container center'>
                <div className='flex_profile'>
                  <Button onClick={handleLogout} type="default" size='large'>Sair (Logout)</Button>
                </div>
              </div>      
        </>
      )}
      <Modal open={showNewLogin} onCancel={() => setShowNewLogin(false)} footer={null}>
        <ClientForm />
      </Modal>
    </div>
  );
};

export default Profile;
