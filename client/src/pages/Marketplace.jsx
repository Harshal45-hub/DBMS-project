import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaCheckCircle, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Marketplace.css';

const Marketplace = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    { id: 1, name: "Premium Denim Jacket", price: 129.99, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80", category: "Outerwear", rating: 4.8 },
    { id: 2, name: "Minimalist Sneakers", price: 85.00, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80", category: "Footwear", rating: 4.9 },
    { id: 3, name: "Cashmere Turtleneck", price: 150.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80", category: "Sweaters", rating: 4.7 },
    { id: 4, name: "Artisan Leather Belt", price: 45.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", category: "Accessories", rating: 4.5 },
    { id: 5, name: "Merino Wool Scarf", price: 55.00, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80", category: "Accessories", rating: 4.6 },
    { id: 6, name: "Modern Fit Chinos", price: 95.00, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80", category: "Pants", rating: 4.8 }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
      style: {
        background: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)'
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.error('Item removed');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const checkout = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processing payment...',
        success: <b>Order placed successfully!</b>,
        error: <b>Checkout failed.</b>,
      }
    );
    setCart([]);
    setShowCart(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="marketplace-page"
    >
      <header className="marketplace-header">
        <div className="header-text">
          <h1>Curated Collection</h1>
          <p>Hand-picked premium pieces to elevate your style</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cart-toggle-btn" 
          onClick={() => setShowCart(!showCart)}
        >
          <div className="cart-icon-wrapper">
            <FaShoppingCart />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </div>
          <span>My Cart</span>
        </motion.button>
      </header>
      
      <div className="marketplace-container">
        <div className="products-grid">
          {products.map((product, idx) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="product-card glass-card"
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">{product.category}</div>
              </div>
              <div className="product-info">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <div className="rating"><FaStar /> {product.rating}</div>
                </div>
                <div className="product-footer">
                  <p className="price">${product.price}</p>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product)} 
                    className="add-btn"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showCart && (
            <motion.aside 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="cart-sidebar glass-card"
            >
              <div className="cart-header">
                <h3>Your Selection</h3>
                <button className="close-btn" onClick={() => setShowCart(false)}>×</button>
              </div>
              
              <div className="cart-items thin-scrollbar">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <FaShoppingCart className="empty-icon" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <motion.div 
                      key={`${item.id}-${idx}`}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="cart-item glass-card"
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        <FaTrash />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="cart-footer">
                  <div className="total-row">
                    <span>Total Amount</span>
                    <strong>${getCartTotal()}</strong>
                  </div>
                  <button className="checkout-btn" onClick={checkout}>
                    Complete Purchase <FaCheckCircle />
                  </button>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Marketplace;