import React, { useState, useEffect } from 'react';
import '../global.css';
import { FaRegUser, FaUserClock } from "react-icons/fa";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { Api_VariavelGlobal } from '../global';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import AddressForm from '../components/AddressForm';
import Addresses from './Addresses';

const Profile = () => {
  const [TELEFONE, setTelefone] = useState('');
  const [LOGIN, setNome] = useState('');
  const [EMAIL, setEmail] = useState('');
  const [SENHA, setSenha] = useState('');
  const [REPSENHA, setRepsenha] = useState('');
  const [userData, setUserData] = useState(null); // Para armazenar os dados do usuário
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controle de autenticação

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
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
  };
  

  const handleSubmit = async () => {
    if (!LOGIN || !EMAIL || !TELEFONE || !SENHA || !REPSENHA) {
      message.error('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    if (SENHA !== REPSENHA) {
      message.error('As senhas não coincidem!');
      return;
    }

    const telefoneNumeros = TELEFONE.replace(/\D/g, '');

    const formData = {
      LOGIN,
      NASCIMENTO: '00/00/0000',
      STATUS: '1',
      NIVEL_ACESSO: '0',
      TELEFONE: telefoneNumeros,
      EMAIL,
      SENHA,
      REPSENHA: SENHA,
      DATA: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/register`, formData);
      message.success(response.data.message);
      navigate('/cadastro-confirmation');
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleLogin = async (values) => {
    const hashedPassword = CryptoJS.MD5(values.SENHALOGIN).toString();

    try {
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
    }
  };

  const handleLogout = () => {
    // Remove o token do localStorage ao fazer logout
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove o ID do usuário
    setIsAuthenticated(false);
    setUserData('null'); // Limpa os dados do usuário
  }; 

  return (
    <div>
      {!isAuthenticated ? ( // Renderiza as seções de login e cadastro se não estiver autenticado
        <>
          <div className='section-auth container'>
            <h1 className="titulo-home"><FaUserClock /> Já tenho perfil</h1>
            <p>Efetuar Login</p>
            <Form onFinish={handleLogin}>
              <Form.Item name="EMAIL">
                <Input type='text' size='large' placeholder='Email' />
              </Form.Item>

              <Form.Item name="SENHALOGIN">
                <Input type='password' size='large' placeholder='Senha' />
              </Form.Item>

              <div className='container center'>
                <div className='flex_profile'>
                  <Button type="default" size='large' htmlType="submit">Efetuar Login</Button>
                </div>
              </div>
            </Form>
          </div>

          <div className="section-profile container">
            <Form onFinish={handleSubmit}>
              <h1 className="titulo-home"><FaRegUser /> Crie seu perfil agora!</h1>
              <p>Dados somente para identificar pedido.</p>
              <Form.Item>
                <Input size='large' required name='LOGIN' placeholder='Nome' value={LOGIN} onChange={(e) => setNome(e.target.value)} />
              </Form.Item>

              <Form.Item>
                <InputMask mask="(99) 99999-9999" value={TELEFONE} onChange={(e) => setTelefone(e.target.value)}>
                  {() => <Input required size="large" name="TELEFONE" placeholder="Telefone" />}
                </InputMask>
              </Form.Item>

              <Form.Item>
                <Input size='large' required name='EMAIL' placeholder='Email' value={EMAIL} onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(51% - 12px)' }}>
                  <Input size='large' type='password' required name='SENHA' value={SENHA} placeholder='Senha' onChange={(e) => setSenha(e.target.value)} />
                </Form.Item>
                <Form.Item style={{ display: 'inline-block', marginLeft: '12px', width: 'calc(51% - 12px)' }}>
                  <Input size='large' type='password' required name='REPSENHA' value={REPSENHA} placeholder='Repita a Senha' onChange={(e) => setRepsenha(e.target.value)} />
                </Form.Item>
              </Form.Item>

              <div className='container center'>
                <div className='flex_profile'>
                  <Button type="default" size='large' htmlType="submit">Cadastrar</Button>
                </div>
              </div>
            </Form>
          </div>
        </>
      ) : ( // Renderiza a nova seção quando o usuário está autenticado
        <div className="section-authenticated container">
          <h1 className="titulo-home">Bem-vindo ao seu perfil!</h1>
          <p>Aqui você pode gerenciar suas informações.</p>
          
          {userData && ( // Verifica se os dados do usuário estão disponíveis
            <div>
              <p><strong>Nome:</strong> {userData.LOGIN}</p>
              <p><strong>Email:</strong> {userData.EMAIL}</p>
              <p><strong>Telefone:</strong> {userData.TELEFONE}</p>
              <Addresses />
            </div>
          )}
          
          <div className='center'>
            <div className='flex_profile'>
              <Button className='danger' onClick={handleLogout}>Sair</Button>
            </div>
          </div>
          <AddressForm />          
        </div>
      )}
    </div>
  );
};

export default Profile;
