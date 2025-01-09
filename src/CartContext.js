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

  // Função para adicionar ao carrinho
  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateCartItemQuantity(item.id, existingItem.quantity + item.quantity);
    } else {
      setCartItems([...cartItems, { ...item, quantity: item.quantity }]);
    }
  };

  // Função para remover do carrinho
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Função para limpar o carrinho
  const clearCart = () => setCartItems([]);

  // Função para calcular o total do carrinho
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (parseFloat(item.PRECO_ATUAL)) * (item.quantity), 0)
      .toFixed(2);
  };

  // Função para calcular o total de itens no carrinho
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        removeFromCart,
        updateCartItemQuantity,
        calculateTotal,
        calculateTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
