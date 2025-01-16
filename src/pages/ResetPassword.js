import React, { useState } from "react";
import axios from "axios";
import { Api_VariavelGlobal } from '../global';
import { Form, Input, Button, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom'; // Importando useParams

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  // Usando o hook useParams para acessar o token da URL
  const { token } = useParams();
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (values) => {
    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      setMessageColor('red');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/reset-password/${token}`, { token, password });

      if (response.status === 200) {
        setMessage("Senha alterada com sucesso!");
        setMessageColor('green');
        // Redireciona para a página de login após sucesso
        navigate("/alteracao-confirmation"); // Redireciona para a página de login ou qualquer página desejada
      } else {
        throw new Error(response.data.message || "Erro desconhecido.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao alterar senha. Tente novamente.");
      setMessageColor('red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop:'30px' }}>
      <h2 style={{ textAlign: "center" }}>Redefinir Senha</h2>
      <Form name="reset-password" onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Nova Senha" name="password" rules={[{ required: true, message: "Digite sua nova senha!" }]}>
          <Input.Password placeholder="Nova Senha" />
        </Form.Item>
        <Form.Item label="Confirmar Senha" name="confirmPassword" rules={[{ required: true, message: "Confirme sua senha!" }]}>
          <Input.Password placeholder="Confirme sua Senha" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </Form.Item>
      </Form>

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
        />
      )}
    </div>
  );
};

export default ResetPassword;
