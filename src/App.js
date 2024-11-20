// App.js
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import EnderecoConfirmation from './components/EnderecoConfirmation';
import AlteracaoConfirmation from './components/AlteracaoConfirmation';
import Confirmacao from './components/Confirmacao';
import ProductsCategory from './components/ProductsCategory';
import ProductsAll from './components/ProductsAll';
import ProductsByBrand from './pages/ProductsByBrand';
import './global.css';

import { CartProvider } from './CartContext'; // Certifique-se de importar o provider

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const toggleCart = () => {
    setCartOpen((prev) => {
      console.log('Cart Open:', !prev); // Log para verificar o estado
      return !prev;
    });
  }; 

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <AuthProvider>
    <CartProvider>
    <Router>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div translate="no" style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/ProductsAll" element={<ProductsAll />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cadastro-confirmation" element={<CadastroConfirmation />} />
          <Route path="/endereco-confirmation" element={<EnderecoConfirmation />} />
          <Route path="/alteracao-confirmation" element={<AlteracaoConfirmation />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/brands" element={<BrandList />} />
          <Route path="/produtos/categoria/:idCategoria" element={<ProductsCategory />} />
          <Route path="/" element={<CategoryList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/confirmacao" element={<Confirmacao />} />
          <Route path="/produtos/marca/:brandId" element={<ProductsByBrand />} />
          <Route path="*" element={<Navigate to="/" />} />
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
