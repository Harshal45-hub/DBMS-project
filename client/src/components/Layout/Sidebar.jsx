import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTshirt, 
  FaMagic, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaStore,
  FaHeart,
  FaGift
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const [showDripModal, setShowDripModal] = useState(false);
  const [dripScore, setDripScore] = useState(0);

  useEffect(() => {
    // We would fetch stats here, simulating for now
    setDripScore(87);
  }, []);

  const menuItems = [
    { path: '/wardrobe', icon: <FaTshirt />, label: 'Wardrobe' },
    { path: '/outfits', icon: <FaMagic />, label: 'Outfit Generator' },
    { path: '/social', icon: <FaUsers />, label: 'Social Hub' },
    { path: '/planner', icon: <FaCalendarAlt />, label: 'Planner' },
    { path: '/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/marketplace', icon: <FaStore />, label: 'Marketplace' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                <div className="active-indicator" />
              </NavLink>
            </motion.div>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="quick-actions">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="quick-action-btn pulse-purple"
              onClick={() => setShowDripModal(true)}
            >
              <FaHeart className="text-pink" /> 
              <span>Drip Score</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="quick-action-btn pulse-blue"
              onClick={() => window.location.href = '/gifts'}
            >
              <FaGift className="text-blue" /> 
              <span>Gift Ideas</span>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Drip Score Modal */}
      {showDripModal && (
        <div className="modal-backdrop" onClick={() => setShowDripModal(false)}>
          <motion.div 
            className="drip-modal glass-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drip-header">
              <h2><FaHeart className="text-pink" /> Your Drip Score</h2>
              <button className="close-btn" onClick={() => setShowDripModal(false)}>×</button>
            </div>
            
            <div className="drip-content">
              <div className="score-circle">
                <span className="score-text">{dripScore}</span>
                <span className="score-max">/ 100</span>
              </div>
              <div className="drip-status">
                <h3>Absolute Fire 🔥</h3>
                <p>Your wardrobe consistency is top tier. You've earned +15 points this week for color coordination!</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowDripModal(false);
                  window.location.href = '/analytics';
                }}
              >
                View Full Analytics
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;