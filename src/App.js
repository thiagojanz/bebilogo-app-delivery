// App.js
import React, { useState } from 'react';
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
import Checkout from './components/Checkout'; // Importe o componente Checkout
import OrderConfirmation from './pages/OrderConfirmation'; // Importe a tela de confirmação
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
    <CartProvider>
    <Router>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <div style={{ paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
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
  );
};

export default App;
