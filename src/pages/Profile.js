// Checkout.js
import React, { useState, useEffect } from 'react';
import '../global.css';
import { FaDoorOpen, FaRegUser, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import axios from 'axios';
import InputMask from 'react-input-mask'; // Importa InputMask
import Loginmodal from '../components/Loginmodal';
import { Api_VariavelGlobal } from '../global';
import { Button, Form, Input } from 'antd';

const Profile = () => {
  const [TELEFONE, setTelefone] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [CEP, setCep] = useState(''); // Adicionar estado para o CEP
  const [addresses, setAddresses] = useState([]);
  const [NOME, setNome] = useState([]);
  const [EMAIL, setEmail] = useState([]);
  const [ENDERECO, setEndereco] = useState([]);
  const [NUMERO, setNumero] = useState([]);
  const [BAIRRO, setBairro] = useState([]);
  const [CIDADE, setCidade] = useState([]);
  const [UF, setUf] = useState([]);

  // Função para buscar o endereço baseado no CEP
  const fetchAddressByCep = async (CEP) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${CEP}/json/`);
      if (response.data && !response.data.erro) {
        setAddresses([{
          ENDERECO: response.data.logradouro,
          COMPLEMENTO: response.data.complemento,
          BAIRRO: response.data.bairro,
          CIDADE: response.data.localidade,
          UF: response.data.uf,
        }]);
      } else {
        console.error("CEP não encontrado");
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  // Monitora o valor de `cep` e chama a função de busca uma vez quando o CEP é completo (8 dígitos)
  useEffect(() => {
    if (CEP.length === 8) {
      fetchAddressByCep(CEP);
    }
  }, [CEP]); // Somente executa quando `cep` muda para evitar loop infinito

  const handleCepChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setCep(rawValue);
  };

  const handleSubmit = async () => {
    const formData = {
      NOME,
      EMAIL,
      TELEFONE,
      ENDERECO,
      NUMERO,
      CEP,
      CIDADE,
      BAIRRO,
      UF,
    };
  
    console.log("Dados enviados:", formData); // Adicione esta linha
  
    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/register`, formData);
      console.log(response.data.message); // Mensagem de sucesso
    } catch (error) {
      console.error(error.response.data.message); // Mensagem de erro
    }
  };
 
  return (
    <div>
      <div className="container">
      <h1 className="titulo-home"><FaUser /> Meu Perfil</h1>
      <p>Cliente não identificado, favor identificar-se!!!</p>

      <div className=''>
        <div className='container center'>
          <div className='flex_profile'>
            <Button type="primary" size='large' onClick={() => setShowLogin(true)}>Entrar <FaDoorOpen /></Button>
          </div>
        </div>
        {showLogin && <Loginmodal onClose={() => setShowLogin(false)} />}
      </div>

      <Form onFinish={handleSubmit}>
       <div className=''>
       <h1 className="titulo-home"><FaRegUser /> Crie seu perfil agora</h1>
        <p>Faça seus pedidos rápido e fácil</p>
        <Form.Item>
          <Input size='large' required name='NOME' placeholder='Nome'  value={NOME} onChange={(e) => setNome(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Input size='large' required name='EMAIL' placeholder='Email' value={EMAIL} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <InputMask mask="(99) 99999-9999" value={TELEFONE} onChange={(e) => setTelefone(e.target.value)}>{() => 
          <Input required size="large" name="TELEFONE" placeholder="Telefone" />}
          </InputMask>
        </Form.Item>
        </div>             
        
        <div className=''>
        <h1 className="titulo-home"><FaMapMarkerAlt /> Endereço para Entrega</h1>
        <div>
        <p>Digite o <b>CEP</b> para adicionar um endereço.</p>
        <Form.Item>
          <InputMask require mask="99999-999" value={CEP} onChange={handleCepChange}>{() => <Input required size="large" name="CEP" placeholder="Cep" />}
          </InputMask>
        </Form.Item>

              {addresses.length === 0 ? (
              <div className=''>
                <Form.Item>
                      <Input disabled size='large' name='ENDERECO' placeholder='Endereço' readOnly info='Preencha o Cep'/>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Form.Item style={{ display: 'inline-block', width: 'calc(29% - 12px)' }}>
                        <Input disabled name='NUMERO' size='large' placeholder='Nº'/>
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(75% - 12px)' }}>
                        <Input disabled name='COMPLEMENTO' size='large' placeholder='Complemento'/>
                      </Form.Item>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Form.Item style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}>
                        <Input disabled name='BAIRRO' size='large' placeholder='Bairro'/>
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(47% - 12px)' }}>
                        <Input disabled name='CIDADE' size='large' placeholder='Cidade' />
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(20% - 12px)' }}>
                        <Input disabled name='UF' size='large' placeholder='Uf' />
                      </Form.Item>
                    </Form.Item> 
              </div>
            ) : ( 
              addresses.map((address, index) => (
                <div className='items-list' key={index}>
                  <div className=''>
                    <Form.Item>
                      <Input required disable size='large' name='ENDERECO' 
                      value={address.ENDERECO} placeholder='Endereço' onChange={(e) => setEndereco(e.target.value)} />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Form.Item style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}>
                        <Input required name='NUMERO' size='large' value={address.NUMERO} onChange={(e) => setNumero(e.target.value)} />
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(75% - 12px)' }}>
                        <Input name='COMPLEMENTO' size='large'/>
                      </Form.Item>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Form.Item style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}>
                        <Input require readOnly name='BAIRRO' size='large' value={address.BAIRRO} onChange={(e) => setBairro(e.target.value)} />
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(47% - 12px)' }}>
                        <Input require readOnly name='CIDADE' size='large' value={address.CIDADE} onChange={(e) => setCidade(e.target.value)} />
                      </Form.Item>
                      <Form.Item style={{ display: 'inline-block', paddingLeft: '10px', width: 'calc(20% - 12px)' }}>
                      <Input require readOnly name='UF' size='large' value={address.UF} onChange={(e) => setUf(e.target.value)} />
                      </Form.Item>
                    </Form.Item>
                    </div>                 
                </div>
              ))
            )}
            <div className='container center'>
          <div className='flex_profile'>
            <Button type="default" size='large' htmlType="submit">Cadastrar</Button>
          </div>
        </div> 
        </div>
        </div>
        </Form>
      </div>
    </div>
  );
};

export default Profile;