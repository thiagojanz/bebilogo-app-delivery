import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { Api_VariavelGlobal } from '../global';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
      if (response.data && !response.data.erro) {
        setEndereco(response.data.logradouro || '');
        setBairro(response.data.bairro || '');
        setCidade(response.data.localidade || '');
        setUf(response.data.uf || '');
      } else {
        console.error("CEP não encontrado");
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
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
      console.error("Erro ao salvar endereço:", error);
      message.error(error.response.data.message);
    }
  };
  
  return (
    <Form onFinish={handleSubmit}>
      {userData && (
        <Input type='hidden' size='large' name='ID_USUARIO' value={userData.ID_USUARIO} />
      )}
      <h1 className="titulo-home"><FaMapMarkerAlt /> Endereço para Entrega</h1>
      <div>
        <p>Digite o <b>CEP</b> para adicionar um endereço.</p>
        <Form.Item>
          <InputMask mask="99999-999" value={CEP} onChange={handleCepChange}>
            {() => <Input required size="large" name="CEP" placeholder="Cep" />}
          </InputMask>
        </Form.Item>
        <Form.Item>
          <Input required size='large' name='ENDERECO' value={ENDERECO} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item style={{ display: 'inline-block', width: 'calc(29% - 12px)' }}>
            <Input required name='NUMERO' size='large' value={NUMERO} onChange={(e) => setNumero(e.target.value)} placeholder='Nº'/>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(75% - 12px)' }}>
            <Input name='COMPLEMENTO' size='large' value={COMPLEMENTO} onChange={(e) => setComplemento(e.target.value)} placeholder='Complemento'/>
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}>
            <Input required readOnly name='BAIRRO' size='large' value={BAIRRO} placeholder='Bairro'/>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(45% - 12px)' }}>
            <Input required readOnly name='CIDADE' size='large' value={CIDADE} placeholder='Cidade' />
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(21% - 12px)' }}>
            <Input required readOnly name='UF' size='large' value={UF} placeholder='Uf'/>
          </Form.Item>
        </Form.Item>
        <div className='container center'>
          <div className='flex_profile'>
            <Button type="default" size='large' htmlType="submit">Cadastrar</Button>
          </div>
        </div> 
      </div>        
    </Form>
  );
};

export default AddressForm;
