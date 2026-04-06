import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Chatbot from './components/AI/Chatbot';

// Import pages
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import OutfitGenerator from './pages/OutfitGenerator';
import SocialHub from './pages/SocialHub';
import Planner from './pages/Planner';
import Analytics from './pages/Analytics';
import Marketplace from './pages/Marketplace';
import SharedWardrobe from './pages/SharedWardrobe';
import StealThisFitPage from './pages/StealThisFitPage';
import ReelFeedPage from './pages/ReelFeedPage';
import GiftSuggestionsPage from './pages/GiftSuggestionsPage';
import ProfileSettings from './pages/ProfileSettings';


// Import styles
import './styles/globals.css';
import './styles/variables.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="main-container">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/outfits" element={<OutfitGenerator />} />
              <Route path="/social" element={<SocialHub />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/shared/:token" element={<SharedWardrobe />} />
              <Route path="/steal" element={<StealThisFitPage />} />
              <Route path="/reels" element={<ReelFeedPage />} />
              <Route path="/gifts" element={<GiftSuggestionsPage />} />
              <Route path="/profile" element={<ProfileSettings />} />
            </Routes>
          </main>
        </div>
        <Footer />
        <Chatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;