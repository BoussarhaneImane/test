import React, { createContext, useState, useEffect } from 'react';

// Création du contexte du panier
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  // Fonction pour obtenir la clé du panier liée à un utilisateur
  const getCartKey = () => `cart_${userName}`;

  // Charger les articles du panier à partir de localStorage
  useEffect(() => {
    if (userName) {
      const storedCartItems = localStorage.getItem(getCartKey());
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    }
  }, [userName]);

  // Sauvegarder les articles du panier dans localStorage
  useEffect(() => {
    if (userName) {
      localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    }
  }, [cartItems, userName]);

  // Fonction pour ajouter un produit au panier, en mélangeant les produits de tous les composants
  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Si le produit existe déjà, augmenter la quantité
        return prevCartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Sinon, ajouter le nouveau produit à la liste globale
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Fonction pour modifier la quantité d'un produit
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Fonction pour retirer un produit
  const handleRemoveItem = (id) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        handleQuantityChange,
        handleRemoveItem,
        setUserName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
