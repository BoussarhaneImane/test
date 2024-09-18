import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  useEffect(() => {
    if (userName) {
      const cartKey = `cart_${userName}`;
      const storedCartItems = localStorage.getItem(cartKey);
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    }
  }, [userName]);

  useEffect(() => {
    if (userName) {
      const cartKey = `cart_${userName}`;
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, userName]);

  const addToCart = (product) => {
    setCartItems(prevCartItems => [
      ...prevCartItems,
      { ...product, quantity: 1 }
    ]);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevCartItems =>
      prevCartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, handleQuantityChange, handleRemoveItem, setUserName }}>
      {children}
    </CartContext.Provider>
  );
};
