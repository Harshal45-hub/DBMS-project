import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoon, FaSun, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">👔</span>
          <span className="logo-text">AI Wardrobe</span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/wardrobe">Wardrobe</Link>
          <Link to="/outfits">Outfits</Link>
          <Link to="/social">Social</Link>
          <Link to="/planner">Planner</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
        
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="user-menu" onClick={() => window.location.href = '/profile'}>
            <FaUser />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;