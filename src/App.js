import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import BrandList from './pages/BrandList';
import CategoryList from './pages/CategoryList';
import Home from './pages/Home';
import Search from './pages/Search';
import Orders from './pages/Orders';
import Shoppingcart from './pages/Shoppingcart';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
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
import ToAccompany from './components/AcompanharPedidos';

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
    <Router>
      <AuthProvider>
        <CartProvider>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          <div translate="no" style={{ paddingBottom: '60px' }}>
            <CheckRoute>
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />                
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/acompanhar-pedido/:id" element={<ToAccompany />} />
                <Route path="/shoppingcart" element={<Shoppingcart />} />
                <Route path="/ProductsAll" element={<ProductsAll />} />
                <Route path="/cadastro-confirmation" element={<CadastroConfirmation />} />
                <Route path="/endereco-confirmation" element={<EnderecoConfirmation />} />
                <Route path="/alteracao-confirmation" element={<AlteracaoConfirmation />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/brands" element={<BrandList />} />
                <Route path="/produtos/categoria/:idCategoria" element={<ProductsCategory />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/confirmacao" element={<Confirmacao />} />
                <Route path="/produtos/marca/:brandId" element={<ProductsByBrand />} />
                {/* 
                <Route path="*" element={<Navigate to="/" />} />
                */}
              </Routes>
            </CheckRoute>
          </div>
          <Footer />
          <FloatingCartIcon onClick={toggleCart} />
          {cartOpen && <Cart onClose={toggleCart} />}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

function CheckRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Se a localização não corresponder a nenhuma rota definida
    if (location.pathname === "/404") {
      navigate("/");
      alert("Página não encontrada. Você foi redirecionado para a página inicial.");
    }
  }, [location, navigate]);

  return children;
}

export default App;
