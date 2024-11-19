import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Button, message, Input, Form } from 'antd';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import CryptoJS from 'crypto-js';

const ClientForm = () => {
  const [TELEFONE, setTelefone] = useState('');
  const [LOGIN, setNome] = useState('');
  const [EMAIL, setEmail] = useState('');
  const [SENHA, setSenha] = useState('');
  const [REPSENHA, setRepsenha] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true); // Ativa o estado de carregamento
  
    // Validações locais
    if (!LOGIN || !EMAIL || !TELEFONE || !SENHA || !REPSENHA) {
      setLoading(false);
      return message.error('Todos os campos obrigatórios devem ser preenchidos!');
    }
  
    if (SENHA !== REPSENHA) {
      setLoading(false);
      return message.error('As senhas não coincidem!');
    }
  
    const telefoneNumeros = TELEFONE.replace(/\D/g, ''); // Remove caracteres especiais
  
    const hashedPassword = CryptoJS.MD5(SENHA).toString(); // Cria o hash MD5 da senha
  
    const formData = {
      LOGIN,
      NASCIMENTO: '00/00/0000',
      STATUS: '1',
      NIVEL_ACESSO: '0',
      TELEFONE: telefoneNumeros,
      EMAIL,
      SENHA: hashedPassword, // Envia a senha hashada
      REPSENHA: hashedPassword, // Garante que o campo REPSENHA também use o hash
      DATA: new Date().toISOString(),
    };
  
    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/register`, formData);
      message.success(response.data.message || 'Cadastro realizado com sucesso!');
      navigate('/cadastro-confirmation');
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false); // Sempre desativa o carregamento
    }
  };
  

  return (
    <div>
      <Form onFinish={handleSubmit}>
        <h1 className="titulo-home"><FaUserPlus /> Novo Cliente</h1>
        <p>Dados somente para identificar pedido.</p>

        <Form.Item name="LOGIN">
          <Input
            size="large"
            required
            placeholder="Nome"
            value={LOGIN}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="TELEFONE">
          <InputMask
            mask="(99) 99999-9999"
            value={TELEFONE}
            onChange={(e) => setTelefone(e.target.value)}
          >
            {() => <Input required size="large" placeholder="Telefone" />}
          </InputMask>
        </Form.Item>

        <Form.Item name="EMAIL">
          <Input
            size="large"
            required
            placeholder="Email"
            value={EMAIL}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="SENHA" style={{ marginBottom: 0 }}>
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
            <Input.Password
              size="large"
              required
              placeholder="Senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setSenha(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="REPSENHA" style={{ display: 'inline-block', marginLeft: '23px', width: 'calc(50% - 12px)' }}>
            <Input.Password
              size="large"
              required
              placeholder="Repita Senha"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              onChange={(e) => setRepsenha(e.target.value)}
            />
          </Form.Item>
        </Form.Item>

        <div className="container center">
          <div className="flex_profile">
            <Button type="default" size="large" htmlType="submit" loading={loading}>
              Cadastrar
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ClientForm;
