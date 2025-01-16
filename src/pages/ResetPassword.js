import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Alert } from "antd";
import { Api_VariavelGlobal } from '../global';

const ResetPassword = () => {
  const { token: paramToken } = useParams(); // Captura o token da URL
  const navigate = useNavigate();

  const [token, setToken] = useState(null); // Inicializa como null
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true); // Novo estado para validação inicial

  // Captura o token da URL dinâmica
  useEffect(() => {
    if (paramToken) {
      setToken(paramToken); // Define o token recebido
      setMessage(""); // Limpa mensagens de erro
    } else {
      setMessage("Erro! Token não encontrado na URL.");
    }
    setValidating(false); // Finaliza a validação inicial
  }, [paramToken]);

  // Lógica para verificar se o token é válido
  useEffect(() => {
    if (!validating && !token) {
      setMessage("Erro! Token inválido ou expirado.");
    }
  }, [token, validating]);

  // Função para redefinir senha
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setMessage("Erro! As senhas não coincidem!");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/reset_password/${token}`, {
        password,
      });
      setMessage(response.data.message || "Senha redefinida com sucesso!");
      setTimeout(() => navigate("/alteracao-confirmation"), 3000); // Redireciona após 3s
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Determina o tipo de mensagem: 'error' ou 'success'
  const getMessageType = () => {
    if (message.includes("Erro") || message.includes("inválido")) {
      return "error"; // Cor vermelha para erro
    }
    return "success"; // Cor verde para sucesso
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h2>Redefinir Senha</h2>
      {validating ? (
        <p>Carregando...</p> // Exibe uma mensagem enquanto valida
      ) : (
        <>
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Nova Senha"
              name="password"
              rules={[{ required: true, message: "Por favor, insira sua nova senha!" }, { min: 6, message: "A senha deve ter no mínimo 6 caracteres!" }]}
            >
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
            </Form.Item>
            <Form.Item
              label="Confirmar Nova Senha"
              name="confirmPassword"
              rules={[{ required: true, message: "Por favor, confirme sua nova senha!" }, { min: 6, message: "A senha deve ter no mínimo 6 caracteres!" }]}
            >
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </Form.Item>
          </Form>

          {message && (
            <Alert
              message={message}
              type={getMessageType()} // Usa a função para determinar o tipo
              showIcon
              style={{ marginTop: 20 }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ResetPassword;
