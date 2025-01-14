import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Alert } from "antd";

const ResetPassword = () => {
  const { token: paramToken } = useParams(); // Captura o token da URL (rota dinâmica)
  const location = useLocation(); // Captura o query string da URL
  const navigate = useNavigate();

  const [token, setToken] = useState(paramToken || ""); // Inicializa com o token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Extraindo o token da query string, se disponível
  useEffect(() => {
    if (!paramToken) {
      const queryParams = new URLSearchParams(location.search);
      const queryToken = queryParams.get("token");
      if (queryToken) {
        setToken(queryToken);
      } else {
        setMessage("Token não encontrado na URL.");
      }
    }
  }, [location.search, paramToken]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/reset-password", { token, password });
      setMessage(response.data.message || "Senha redefinida com sucesso!");
      setTimeout(() => navigate("/login"), 3000); // Redireciona para login após 3s
    } catch (error) {
      setMessage("Erro ao redefinir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h2>Redefinir Senha</h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Nova Senha" rules={[{ required: true, message: "Por favor, insira sua nova senha!" }]}>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua nova senha"
            required
          />
        </Form.Item>
        <Form.Item label="Confirmar Nova Senha" rules={[{ required: true, message: "Por favor, confirme sua nova senha!" }]}>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua nova senha"
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </Form.Item>
      </Form>

      {message && (
        <Alert
          message={message}
          type={message.includes("Erro") ? "error" : "success"}
          showIcon
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
};

export default ResetPassword;
