// App.js
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import BrandList from './pages/BrandList';
import CategoryList from './pages/CategoryList';
import Home from './pages/Home';
import Search from './pages/Search';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Cart from './pages/Cart'; // Importa o componente do carrinho
import Footer from './components/Footer';
import FloatingCartIcon from './components/FloatingCartIcon';
import SplashScreen from './components/SplashScreen';
import Checkout from './components/Checkout.js'; // Importe o componente Checkout
import OrderConfirmation from './pages/OrderConfirmation'; // Importe a tela de confirmação
import CadastroConfirmation from './components/CadastroConfirmation';
import './global.css';
import axios from 'axios';
import { Api_VariavelGlobal } from './global';


import { CartProvider } from './CartContext'; // Certifique-se de importar o provider

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [storeStatus, setStoreStatus] = useState(null);

  const toggleCart = () => {
    setCartOpen((prev) => {
      console.log('Cart Open:', !prev); // Log para verificar o estado
      return !prev;
    });
  };
  

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    const fetchStoreStatus = () => {
      axios.get(`${Api_VariavelGlobal}/api/status`)
        .then(response => {
          setStoreStatus(response.data.STATUS);
        })
        .catch(error => {
          console.error('Erro ao buscar status da loja:', error);
        });
    };

    // Chamada inicial para definir o status
    fetchStoreStatus();

    // Configura o polling a cada 60 segundos (30000 ms)
    const intervalId = setInterval(fetchStoreStatus, 60000);

    // Limpa o intervalo quando o componente desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className='status'>
        {storeStatus === 1 ? (
          <div className='loja_aberta'></div>
        ) : (
          <div className='loja_fechada'>Loja Fechada</div>
        )}
      </div>
    <Router>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div translate="no" style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cadastro-confirmation" element={<CadastroConfirmation />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/brands" element={<BrandList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
      <Footer />
      <FloatingCartIcon onClick={toggleCart} />
      {cartOpen && <Cart onClose={toggleCart} />}
    </Router>
    </CartProvider>
  </AuthProvider>
  );
};

export default App;
