// CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Função para atualizar a quantidade de um item no carrinho
  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Outras funções do contexto, como adicionar e remover itens do carrinho
  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateCartItemQuantity(item.id, existingItem.quantity + item.quantity);
    } else {
      setCartItems([...cartItems, { ...item, quantity: item.quantity }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
