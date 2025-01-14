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
    const { email } = values; // Desestruturando o valor de email enviado pelo Form
    setLoading(true);
    try {
      // Enviar o e-mail para o backend para iniciar o processo de redefinição de senha
      const response = await axios.post(`${Api_VariavelGlobal}/api/forgot-password`, { email });
      setMessage(response.data.message);

      // Fechar o modal (se aplicável)
      if (closeModal) closeModal();

      // Redirecionar para a página 'reset_senha'
      history.push('/reset_senha');
    } catch (error) {
      setMessage("Erro ao enviar e-mail. Tente novamente.");
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
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={loading}
            disabled={loading}
          >
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
