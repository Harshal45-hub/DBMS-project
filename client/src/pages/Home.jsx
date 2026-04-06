import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaMagic, 
  FaUsers, 
  FaHeart, 
  FaCalendarAlt, 
  FaChartLine, 
  FaRobot, 
  FaShareAlt, 
  FaGift,
  FaStar,
  FaBolt
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    reveals.forEach(reveal => observer.observe(reveal));
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const features = [
    { icon: <FaBolt />, title: 'AI Outfit Generator', desc: 'Get personalized outfit suggestions powered by advanced AI', color: '#4f46e5', delay: 0 },
    { icon: <FaShareAlt />, title: 'Wardrobe Sharing', desc: 'Share your style with friends and get feedback', color: '#10b981', delay: 0.1 },
    { icon: <FaUsers />, title: 'Social Hub', desc: 'Connect with fashion lovers and join challenges', color: '#f59e0b', delay: 0.2 },
    { icon: <FaHeart />, title: 'Couples Mode', desc: 'Coordinate outfits with your partner', color: '#ec489a', delay: 0.3 },
    { icon: <FaCalendarAlt />, title: 'Smart Planner', desc: 'Plan outfits for the week ahead', color: '#8b5cf6', delay: 0.4 },
    { icon: <FaChartLine />, title: 'Style Analytics', desc: 'Track your fashion choices and trends', color: '#06b6d4', delay: 0.5 },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <FaUsers /> },
    { number: '50K+', label: 'Outfits Created', icon: <FaMagic /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <FaHeart /> },
    { number: '24/7', label: 'AI Support', icon: <FaRobot /> },
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Parallax */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div 
            className="hero-cursor" 
            style={{ 
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` 
            }}
          />
        </div>
        
        <div className="hero-content">
          <div className="hero-badge float">
            <FaRobot />
            <span>Powered by LLaMA 3.2 AI</span>
          </div>
          
          <h1 className="hero-title">
            <span className="gradient-text">AI-Powered</span>
            <br />
            Fashion Intelligence
          </h1>
          
          <p className="hero-description">
            Transform your wardrobe with AI-powered outfit suggestions, 
            social fashion sharing, and intelligent style analytics.
            Never run out of outfit ideas again.
          </p>
          
          <div className="hero-buttons">
            <Link to="/wardrobe" className="btn-primary btn-large">
              Get Started <FaArrowRight />
            </Link>
            <Link to="/outfits" className="btn-secondary btn-large">
              Try AI Generator
            </Link>
          </div>
          
          <div className="hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="hero-stat">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="visual-circle"></div>
          <div className="visual-sphere"></div>
          <div className="visual-ring"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Amazing Features</h2>
            <p>Discover what makes AI Wardrobe your ultimate fashion companion</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card reveal" style={{ transitionDelay: `${feature.delay}s` }}>
                <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}cc)` }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="feature-glow" style={{ background: feature.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="ai-showcase">
        <div className="container">
          <div className="showcase-content reveal">
            <div className="showcase-text">
              <div className="showcase-badge">AI Powered</div>
              <h2>Intelligent Fashion Assistant</h2>
              <p>Our advanced AI understands your style preferences, wardrobe composition, and fashion trends to provide personalized recommendations that match your unique taste.</p>
              <ul className="showcase-list">
                <li><FaStar /> Real-time outfit suggestions</li>
                <li><FaMagic /> Style trend analysis</li>
                <li><FaHeart /> Personalized recommendations</li>
                <li><FaGift /> Gift ideas for loved ones</li>
              </ul>
              <Link to="/outfits" className="btn-primary">Try AI Now</Link>
            </div>
            <div className="showcase-visual">
              <div className="ai-orb">
                <div className="orb-core"></div>
                <div className="orb-ring"></div>
                <div className="orb-particles"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content reveal">
            <h2>Ready to Transform Your Style?</h2>
            <p>Join thousands of fashion enthusiasts using AI Wardrobe to elevate their style game</p>
            <Link to="/wardrobe" className="btn-primary btn-large">
              Start Your Journey <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;