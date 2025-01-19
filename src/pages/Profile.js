import React, { useState, useEffect } from 'react';
import '../global.css';
import { FaUserLock, FaUserPlus, FaUser, FaKey, FaTrash, FaEdit } from "react-icons/fa";
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Button, Input, message, Spin, Modal, Card, Flex } from 'antd';
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  
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
        message.error('Erro ao carregar dados');
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
      message.success('Seja Bem Vindo');
      fetchUserData();
    } catch (error) {
      if (error.response) {
        message.error('Erro: ' + (error.response.data.message || 'Erro desconhecido'));
      } else if (error.request) {
        message.error('Erro: O servidor não respondeu');
      } else {
        message.error('Erro: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedUserData(userData); // Preenche os dados do modal com os dados atuais
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editedUserData.LOGIN || !editedUserData.TELEFONE) {
        message.error('Todos os campos devem ser preenchidos.');
        return;
      }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${Api_VariavelGlobal}/api/user/${userData.ID_USUARIO}`, editedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Dados atualizados com sucesso');
      setShowEditModal(false);
      fetchUserData();
    } catch (error) {
      message.error('Erro ao salvar alterações');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${Api_VariavelGlobal}/api/user/${userData.ID_USUARIO}/deactivate`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Usuário Excluido com sucesso');
      handleLogout();
    } catch (error) {
      message.error('Erro ao excluir usuário');
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserData(null);
    message.success('Volte Sempre');
  };

  return (
    <div className='section-auth container'>
      <h1 className="titulo-home"><FaUserLock /> Perfil</h1>
      {loading ? (
        <div className="loading-screen-orders loading-screen">
        <Flex className="loading-icon-screen" align="center">
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

              <div className='container center'>
                <div className='flex_profile'>
                  <Link className='continue-shopping' onClick={() => setShowResetPassword(true)}>
                    <FaKey /> Esqueci a Senha
                  </Link>
                </div>
              </div>
            </Form>
          </>
        ) : (
          <>
            {userData && (
              <Card title={<><FaUser size={20} /> 
              <h3 style={{display:'contents'}}>{'Cliente'}</h3> <br/> <p className="subtitulo-home"> {'Meus Dados:'} </p></>} 
            bordered={true} style={{ width: '100%', marginBottom: '20px' }}> 
                
                <div style={{ display: 'flow-root' }}>
                  <div className="button-trash-user">
                    <FaTrash onClick={() => setShowDeleteModal(true)} size={20} style={{ cursor: 'pointer' }} />
                  </div>
                  <div className="button-edit-user">
                    <FaEdit onClick={handleEdit} size={20} style={{ cursor: 'pointer' }} />
                  </div>
                  </div>
                  
                
                <p><strong>Nome:</strong> {userData.LOGIN}</p>
                <p><strong>Email:</strong> {userData.EMAIL}</p>
                <p><strong>Telefone:</strong> {userData.TELEFONE}</p>
                <Addresses />
              </Card>
            )}
            <div className='container center'>
              <div className='flex_profile' style={{paddingBottom: '30px'}}>
                <Button className='buy-button-2' onClick={handleLogout} type='default' size='large'>Sair (Logout)</Button>
              </div>
            </div>
          </>
        )
      )}

      <Modal open={showEditModal} onCancel={() => setShowEditModal(false)} onOk={handleSaveEdit}>
        <Form layout="vertical">
          <Form.Item label="Nome">
            <Input value={editedUserData.LOGIN} onChange={(e) => setEditedUserData({ ...editedUserData, LOGIN: e.target.value })} />
          </Form.Item>
          <Form.Item label="Email">
            <Input readOnly disabled value={editedUserData.EMAIL} onChange={(e) => setEditedUserData({ ...editedUserData, EMAIL: e.target.value })} />
          </Form.Item>
          <Form.Item label="Telefone">
            <Input value={editedUserData.TELEFONE} onChange={(e) => setEditedUserData({ ...editedUserData, TELEFONE: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={showDeleteModal} onCancel={() => setShowDeleteModal(false)} onOk={handleDelete}>
        <p>Tem certeza que deseja excluir sua conta?</p>
      </Modal>

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
