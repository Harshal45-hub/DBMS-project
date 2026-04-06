import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPalette, FaBell, FaShieldAlt, FaStar, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`, {
      icon: newTheme === 'dark' ? '🌙' : '☀️'
    });
  };

  const tabs = [
    { id: 'account', icon: <FaUser />, label: 'Account' },
    { id: 'preferences', icon: <FaPalette />, label: 'Preferences' },
    { id: 'premium', icon: <FaCrown />, label: 'Subscription' },
    { id: 'security', icon: <FaShieldAlt />, label: 'Security' },
  ];

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header glass-card">
        <div className="profile-avatar">
          <img src="https://ui-avatars.com/api/?name=User&background=8b5cf6&color=fff&size=150" alt="Avatar" />
          <div className="pro-badge"><FaStar /> PRO</div>
        </div>
        <div className="profile-info">
          <h1>SleekStylist99</h1>
          <p>Member since March 2026</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="value">142</span>
              <span className="label">Items</span>
            </div>
            <div className="stat">
              <span className="value">🔥 87</span>
              <span className="label">Drip Score</span>
            </div>
            <div className="stat">
              <span className="value">3.2k</span>
              <span className="label">Likes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <aside className="profile-sidebar glass-card">
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
          <div className="logout-container">
            <button className="logout-btn" onClick={() => toast('Logged out successfully!', { icon: '👋'})}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </aside>

        <main className="profile-main-panel glass-card">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="panel-content"
              >
                <h2>Account Information</h2>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" defaultValue="SleekStylist99" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="user@example.com" />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea rows="4" defaultValue="Fashion enthusiast specializing in minimalist streetwear. Always experimenting with textures." />
                </div>
                <button className="btn-primary" onClick={() => toast.success('Profile updated!')}>Save Changes</button>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="panel-content"
              >
                <h2>Preferences</h2>
                
                <div className="setting-row">
                  <div className="setting-info">
                    <h4>App Theme</h4>
                    <p>Select your aesthetic preference</p>
                  </div>
                  <div className="theme-selector">
                    <button 
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('light')}
                    >
                      Light
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleThemeChange('dark')}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-info">
                    <h4>Push Notifications</h4>
                    <p>Receive outfit reminders and social alerts</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={notifications} 
                      onChange={(e) => {
                        setNotifications(e.target.checked);
                        toast(e.target.checked ? 'Notifications enabled' : 'Notifications disabled', { icon: '🔔' });
                      }} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </motion.div>
            )}

            {activeTab === 'premium' && (
              <motion.div
                key="premium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="panel-content premium-panel"
              >
                <div className="premium-banner">
                  <FaCrown className="premium-icon" />
                  <h2>AI Wardrobe Pro</h2>
                  <p>You're experiencing the ultimate fashion styling package.</p>
                </div>
                
                <ul className="premium-perks">
                  <li>✨ Unlimited AI Outfit Generations</li>
                  <li>✨ High-Resolution Style Exporting</li>
                  <li>✨ Priority Fashion Trend Intel</li>
                  <li>✨ VIP Wardrobe Analytics Dashboard</li>
                </ul>

                <button className="btn-secondary" onClick={() => toast('Subscription billing managed via Stripe', { icon: '💳'})}>
                  Manage Billing
                </button>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="panel-content"
              >
                <h2>Security Settings</h2>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <button className="btn-primary" onClick={() => toast.success('Password updated successfully!')}>Update Password</button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
