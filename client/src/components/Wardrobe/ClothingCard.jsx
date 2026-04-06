import React from 'react';
import { FaHeart, FaTrash, FaMagic, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ClothingCard.css';

const ClothingCard = ({ item, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="clothing-card glass-card"
    >
      <div className="card-image-wrapper">
        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'} alt={item.name} />
        <div className="card-overlay">
          <div className="drip-score-badge">
            <FaChartLine /> {item.dripScore || 0}
          </div>
          <button className="delete-btn" onClick={() => onDelete(item._id)}>
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-tag">{item.subCategory}</div>
        <h3 className="card-title">{item.name}</h3>
        
        <div className="card-meta">
          <div className="color-indicator" style={{ backgroundColor: item.color }}></div>
          <span>{item.color}</span>
          <span className="dot-divider"></span>
          <span>{item.occasion?.[0] || 'Casual'}</span>
        </div>

        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-label">Worn</span>
            <span className="stat-value">{item.timesWorn || 0}x</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Likes</span>
            <span className="stat-value"><FaHeart className="text-pink" /> {item.likes || 0}</span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="suggest-btn"
        >
          <FaMagic /> Get AI Outfit
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClothingCard;