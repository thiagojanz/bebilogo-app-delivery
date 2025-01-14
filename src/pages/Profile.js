import React, { useState, useEffect } from 'react';
import '../global.css';
import { FaUserLock, FaUserPlus, FaUser, FaKey } from "react-icons/fa";
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Button, Input, message, Spin, Modal, Flex, Card } from 'antd';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Addresses from './Addresses';
import ClientForm from '../components/ClientForm';
import { LoadingOutlined } from '@ant-design/icons';
import ForgotPassword from './ForgotPassword';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewLogin, setShowNewLogin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId) {
      try {
        setLoading(true);
        const response = await axios.get(`${Api_VariavelGlobal}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.ID_USUARIO);
      setIsAuthenticated(true);
      message.success('Seja Bem Vindo!!!');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserData(null);
  };

  return (
    <div className='section-auth container'>
      <h1 className="titulo-home"><FaUserLock /> Perfil</h1>
      {loading ? (
        <div className="loading-screen-orders loading-screen">
        <Flex className='loading-icon-screen' align="center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </Flex>
      </div>
      ) : (
        !isAuthenticated ? (
          <>
            <Button className='buy-button-2' type='primary' onClick={() => setShowNewLogin(true)}>
              <FaUserPlus /> Novo Cliente
            </Button>
            <Form onFinish={handleLogin}>
              <Form.Item name="EMAIL">
                <Input required type='text' size='large' placeholder='Email' />
              </Form.Item>

              <Form.Item name="SENHALOGIN">
                <Input.Password
                  required
                  type='password'
                  size='large'
                  placeholder="Senha"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className='container center'>
                <div className='flex_profile'>
                  <Button className='buy-button-2' type="primary" size='large' htmlType="submit">Efetuar Login</Button>
                </div>
              </div>
              <div className='center'>
                <Link className='continue-shopping' onClick={() => setShowResetPassword(true)}>
                  <FaKey /> Esqueci a Senha
                  </Link>
                </div>
            </Form>
          </>
        ) : (
          <>
            {userData && (
              <div>
                <Card title={<><FaUser size={20} /> <h3 style={{display:'contents'}}>{'Cliente'}</h3> <br/> <p className="subtitulo-home"> {'Meus Dados:'} </p></>} 
              bordered={true} style={{ width: '100%', marginBottom: '20px' }}>      
                <Flex vertical gap="0">
                <span><strong>Nome:</strong> {userData.LOGIN}</span>
                <span><strong>Email:</strong> {userData.EMAIL}</span>
                <span><strong>Telefone:</strong> {userData.TELEFONE}</span>
                </Flex>
                </Card>                
                <Addresses />
              </div>
            )}
            <div className='container center'>
              <div className='flex_profile' style={{paddingBottom: '30px'}}>
                <Button className='buy-button-2' onClick={handleLogout} type='default' size='large'>Sair (Logout)</Button>
              </div>
            </div>
          </>
        )
      )}

      <Modal open={showNewLogin} onCancel={() => setShowNewLogin(false)} footer={null}>
        <ClientForm />
      </Modal>

      <Modal open={showResetPassword} onCancel={() => setShowResetPassword(false)} footer={null}>
        <ForgotPassword />
      </Modal>
    </div>
  );
};

export default Profile;