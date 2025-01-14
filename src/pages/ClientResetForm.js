import React, { useState } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';

const ClientResetForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/request-reset-password`, { email });
      setMessage(response.data.message);  // Exibe a resposta de sucesso ou erro
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Erro ao enviar email.');
    }
  };

  return (
    <div>
      <h2>Solicitar Redefinição de Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ClientResetForm;
