import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';
import { useParams, useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post(`${Api_VariavelGlobal}/api/reset-password-confirm`, {
        token,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => history.push('/login'), 3000);  // Redireciona após 3 segundos
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Erro ao redefinir senha.');
    }
  };

  return (
    <div>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nova senha"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a senha"
          required
        />
        <button type="submit">Redefinir</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
