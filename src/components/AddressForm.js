import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Flex, Spin } from 'antd';
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { Api_VariavelGlobal } from '../global';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

const AddressForm = () => {
  const [NUMERO, setNumero] = useState(''); // Use setNumero para atualizar o valor
  const [BAIRRO, setBairro] = useState('');
  const [CIDADE, setCidade] = useState('');
  const [UF, setUf] = useState('');
  const [ID_USUARIO, setIdUsuario] = useState('');
  const [ENDERECO, setEndereco] = useState('');
  const [COMPLEMENTO, setComplemento] = useState(''); // Inclua setComplemento
  const [CEP, setCep] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setloading] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId) {
      try {
        const response = await axios.get(`${Api_VariavelGlobal}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setIdUsuario(response.data.ID_USUARIO);
      } catch (error) {
        message.error('Erro ao carregar os dados do usuário.');
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
  };

  const fetchAddressByCep = async (CEP) => {
    try {
      setloading(true);
      const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
      if (response.data && !response.data.erro) {        
        setEndereco(response.data.logradouro || '');
        setBairro(response.data.bairro || '');
        setCidade(response.data.localidade || '');
        setUf(response.data.uf || '');
      } else {
        message.error('Cep não encontrado.');
      }
    } catch (error) {
      message.error('Endereço não encontrado.');
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (CEP.length === 8) {
      fetchAddressByCep(CEP);
    }
  }, [CEP]);

  const handleCepChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setCep(rawValue);
  };

  const handleSubmit = async () => {
    if (!ID_USUARIO || !CEP || !ENDERECO || !NUMERO || !BAIRRO || !CIDADE || !UF) {
      message.error('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    const formData = {
      ID_USUARIO,
      STATUS: '1',
      CEP: CEP.replace(/\D/g, ''),
      ENDERECO,
      COMPLEMENTO,
      NUMERO,
      BAIRRO,
      CIDADE,
      UF,
      DATA: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/endereco/register`, formData);
      message.success(response.data.message);
      navigate('/endereco-confirmation');
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  if (loading) return (
    <div className="Marcas-section loading-screen center">
      <h3>Carregando endereço...</h3>
      <Flex className='loading-icon-screen'>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    </div>
  );
  
  return (
    <Form onFinish={handleSubmit}>
      {userData && (
        <Input type='hidden' size='large' name='ID_USUARIO' value={userData.ID_USUARIO} />
      )}
      <h1 className="titulo-home"><FaMapMarkerAlt /> Novo endereço</h1>
      <div>
        <p>Digite o <b>CEP</b> para adicionar um endereço.</p>
        <Form.Item>
          <InputMask mask="99999-999" value={CEP} onChange={handleCepChange}>
            {() => <Input required size="large" name="CEP" placeholder="Cep" />}
          </InputMask>
        </Form.Item>
        <Form.Item>
          <Input required readOnly  name='ENDERECO' size='large' value={ENDERECO} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item style={{ display: 'inline-block', width: 'calc(30% - 0px)' }}>
            <Input required name='NUMERO' size='large' value={NUMERO} onChange={(e) => setNumero(e.target.value)} placeholder='Nº'/>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '15px', width: 'calc(70% - 0px)' }}>
            <Input name='COMPLEMENTO' size='large' value={COMPLEMENTO} onChange={(e) => setComplemento(e.target.value)} placeholder='Complemento'/>
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item style={{ display: 'inline-block', width: 'calc(40% - 0px)' }}>
            <Input required readOnly name='BAIRRO' size='large' value={BAIRRO} placeholder='Bairro'/>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(40% - 0px)' }}>
            <Input required readOnly name='CIDADE' size='large' value={CIDADE} placeholder='Cidade' />
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(20% - 0px)' }}>
            <Input required readOnly name='UF' size='large' value={UF} placeholder='Uf'/>
          </Form.Item>
        </Form.Item>
        <div className='container center'>
          <div className='flex_profile'>
            <Button className='buy-button-2' type="primary" size='large' htmlType="submit">Cadastrar</Button>
          </div>
        </div> 
      </div>        
    </Form>
  );
};

export default AddressForm;
