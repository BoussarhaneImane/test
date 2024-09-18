import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems with localStorage
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const cartKey = userName ? `cart_${userName}` : 'cart_guest';
  const [cartItems, setCartItems] = useState(() => {
    // Retrieve from localStorage during initial render
    const storedCartItems = localStorage.getItem(cartKey);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    // Whenever cartItems change, store in localStorage
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (product) => {
    setCartItems(prevCartItems => {
      // Ensure prevCartItems is always an array
      const updatedCartItems = Array.isArray(prevCartItems) ? prevCartItems : [];
  
      // Check if the product already exists in the cart
      const existingItem = updatedCartItems.find(item => item.id === product.id);
  
      if (existingItem) {
        // If the product already exists, increase the quantity
        return updatedCartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If the product doesn't exist in the cart, add it
        return [
          ...updatedCartItems,
          { ...product, quantity: 1 }
        ];
      }
    });
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
