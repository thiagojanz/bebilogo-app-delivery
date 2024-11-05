import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Api_VariavelGlobal } from '../global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(`${Api_VariavelGlobal}/api/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setCustomerData(response.data);
      })
      .catch(() => {
        setToken(null); // Remove token se houver erro
        localStorage.removeItem('token');
      });
    }
  }, [token]);

  const login = (newToken, data) => {
    setToken(newToken);
    setCustomerData(data);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setCustomerData(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, customerData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
