import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>AI E-Wardrobe</h4>
          <p>Your intelligent fashion companion</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/wardrobe">Wardrobe</a></li>
            <li><a href="/outfits">Outfit Generator</a></li>
            <li><a href="/social">Social Hub</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li><a href="/planner">Outfit Planner</a></li>
            <li><a href="/analytics">Analytics</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} AI E-Wardrobe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;