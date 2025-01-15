import React, { useState } from "react";
import axios from "axios";
import { Api_VariavelGlobal } from '../global';
import { Form, Input, Button, Alert } from 'antd'; 
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ForgotPassword = ({ closeModal }) => {  // closeModal será a função que vai fechar o modal
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(''); // Estado para controlar a cor da mensagem
  const frontendUrl = process.env.FRONTEND_URL || window.location.origin;

  
  // Função que será chamada ao enviar o formulário
  const handleSubmit = async (values) => {
    const { email } = values;
    setLoading(true);
  
    try {
      // Faz a requisição para o backend
      const response = await axios.post(
        `${Api_VariavelGlobal}/api/forgot-password`, 
        { email },
        { headers: { 'Frontend-Url': frontendUrl } } // Envia a URL do frontend no cabeçalho
      );
  
      // Verifica se o status HTTP indica sucesso
      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message || "E-mail enviado com sucesso.");
        setMessageColor('green'); // Cor verde para sucesso
        if (closeModal) closeModal();
      } else {
        throw new Error(response.data.message || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro:", error); // Log para depuração
      setMessage(
        error.response?.data?.message || "Erro ao enviar e-mail. Tente novamente."
      );
      setMessageColor('red'); // Cor vermelha para erro
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ maxWidth: 400, margin: "0 auto"}}>
      <h2 style={{ textAlign: "center" }}>Esqueci minha Senha</h2>
      <Form name="forgot-password" onFinish={handleSubmit} layout="vertical">
        <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Por favor, insira seu e-mail!" }, { type: "email", message: "E-mail inválido!" }]}>
            <Input type="email" placeholder="Digite seu e-mail"/>
        </Form.Item>
        
        <Form.Item>
          <div className='container center'>
            <div className='flex_profile'>
              <Button style={{marginTop:'0px'}} className='buy-button-2' type="primary" size='large' htmlType="submit" block loading={loading} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Link de Redefinição"}</Button>
            </div>
          </div>
        </Form.Item>
      </Form>

      {message && (
  <Alert
    message={message}
    type={message === "Erro ao enviar e-mail. Tente novamente." ? "error" : "success"}
    showIcon={true} // Exibe o ícone do Alert
    style={{
      color: messageColor, 
      borderColor: messageColor,
      backgroundColor: 'white',
      marginTop: '0px'
    }}
    icon={<ExclamationCircleOutlined style={{ color: message === "Erro ao enviar e-mail. Tente novamente." ? 'red' : messageColor }} />} // Personaliza o ícone
  />
)}

    </div>
  );
};

export default ForgotPassword;
