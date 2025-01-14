import React, { useState } from "react";
import axios from "axios";
import { Api_VariavelGlobal } from '../global';
import { Form, Input, Button, Alert } from 'antd'; 
import { useNavigate } from 'react-router-dom'; // Importando o hook useHistory para redirecionamento

const ForgotPassword = ({ closeModal }) => {  // closeModal será a função que vai fechar o modal
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate(); // Hook para redirecionamento

  // Função que será chamada ao enviar o formulário
  const handleSubmit = async (values) => {
    const { email } = values;
    setLoading(true);
  
    try {
      // Faz a requisição para o backend
      const response = await axios.post(`${Api_VariavelGlobal}/api/forgot-password`, { email });
  
      // Verifica se o status HTTP indica sucesso
      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message || "E-mail enviado com sucesso.");
        if (closeModal) closeModal();
        history('/reset_senha'); // Redireciona para a página de redefinição de senha
      } else {
        throw new Error(response.data.message || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro:", error); // Log para depuração
      setMessage(
        error.response?.data?.message || "Erro ao enviar e-mail. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Esqueci minha Senha</h2>
      <Form
        name="forgot-password"
        onFinish={handleSubmit} // Usando onFinish ao invés de onSubmit
        layout="vertical"
      >
        <Form.Item
          label="E-mail"
          name="email"
          rules={[{ required: true, message: "Por favor, insira seu e-mail!" }]}
        >
          <Input
            type="email"
            placeholder="Digite seu e-mail"
            required
          />
        </Form.Item>

        <Form.Item>
          <Button className="buy-button-2" type="primary" htmlType="submit" block loading={loading} disabled={loading} onClick={handleSubmit}>
            {loading ? "Enviando..." : "Enviar Link de Redefinição"}
          </Button>
        </Form.Item>
      </Form>

      {message && (
        <Alert
          message={message}
          type={message === "Erro ao enviar e-mail. Tente novamente." ? "error" : "success"}
          showIcon
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
