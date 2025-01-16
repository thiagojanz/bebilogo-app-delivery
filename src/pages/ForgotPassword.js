import React, { useState, useEffect } from "react";
import axios from "axios";
import { Api_VariavelGlobal } from '../global';
import { Form, Input, Button, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ForgotPassword = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [codeSent, setCodeSent] = useState(false); // Controle para exibir o campo de código
  const [verificationCode, setVerificationCode] = useState(''); // Armazena o código digitado
  const [email, setEmail] = useState(''); // Estado para armazenar o e-mail

  // Preenche o campo de e-mail automaticamente se o usuário estiver logado
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail"); // ou sessionStorage
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Função que será chamada ao enviar o formulário de e-mail
  const handleSubmitEmail = async (values) => {
    const { email } = values;
    setLoading(true);

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/forgot-password`, { email });

      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message || "E-mail de redefinição enviado!");
        setMessageColor('green');
        setCodeSent(true); // Exibe o campo de código
      } else {
        throw new Error(response.data.message || "Erro desconhecido.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao enviar e-mail. Tente novamente.");
      setMessageColor('red');
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar o código
  const handleVerifyCode = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/verify-code`, { token: verificationCode, email: email }); // Use o e-mail armazenado

      if (response.status === 200) {
        window.location.href = `/reset-password/${verificationCode}`; // Redireciona para a página de redefinição
      } else {
        setMessage("Código inválido. Tente novamente.");
        setMessageColor('red');
      }
    } catch (error) {
      setMessage("Erro ao validar código. Tente novamente.");
      setMessageColor('red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Esqueci minha Senha</h2>
      {!codeSent ? (
        <Form name="forgot-password" onFinish={handleSubmitEmail} layout="vertical">
          <Form.Item
            label="E-mail"
            name="email"
            initialValue={email} // Preenche o campo com o e-mail
            rules={[
              { required: true, message: "Por favor, insira seu e-mail!" },
              { type: "email", message: "E-mail inválido!" },
            ]}
          >
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email} // Vincula o valor do campo ao estado `email`
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Link de Redefinição"}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <Form.Item label="Código de Verificação">
            <Input
              placeholder="Digite o código de 6 dígitos"
              maxLength={6}
              onChange={(e) => setVerificationCode(e.target.value)}
              value={verificationCode}
            />
          </Form.Item>
          <Button
            type="primary"
            block
            loading={loading}
            disabled={verificationCode.length !== 6}
            onClick={handleVerifyCode}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </Button>
        </div>
      )}

      {message && (
        <Alert
          message={message}
          type={messageColor === "red" ? "error" : "success"}
          showIcon
          style={{
            color: messageColor,
            borderColor: messageColor,
            backgroundColor: "white",
            marginTop: "10px",
          }}
          icon={
            <ExclamationCircleOutlined
              style={{ color: messageColor }}
            />
          }
        />
      )}
    </div>
  );
};

export default ForgotPassword;
