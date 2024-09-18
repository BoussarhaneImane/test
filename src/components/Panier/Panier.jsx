import React, { useState, useContext, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import './Panier.css';
import { CartContext } from '../../components/context/CartContext';

const Panier = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartItems, handleQuantityChange, handleRemoveItem } = useContext(CartContext);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  return (
    <div className="shop-page-container">
      <h2 className="panier-title">Votre Panier</h2>
      <div className="shop-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Votre panier est vide.</p>
        ) : (
          cartItems.map((item) => (
            <div className="shop-item" key={item.id}>
              <img src={item.img} alt={item.title} className="item-image" />
              <div className="shop-item-info">
                <h3>{item.title}</h3>
                <p>Prix: ${item.price}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="remove-item"
                >
                  <FaTrash size={30} className="ml-8 md:ml-12 lg:ml-16 xl:ml-16" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="total-price">
          <h2>Total: ${totalPrice.toFixed(2)}</h2>
          <button className="checkout-btn">Passer à la caisse</button>
        </div>
      )}
    </div>
  );
};

export default Panier;
