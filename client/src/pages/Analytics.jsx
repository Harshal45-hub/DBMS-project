import React, { useState, useEffect } from 'react';
import { analyzeWardrobe } from '../services/aiService';
import { fetchClothingItems } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartPie, FaChartBar, FaLightbulb, FaTshirt, FaFire, FaLeaf } from 'react-icons/fa';
import './Analytics.css';

const Analytics = () => {
  const [items, setItems] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadBaseData();
    loadAIInsights();
  }, []);

  const loadBaseData = async () => {
    try {
      setLoading(true);
      const wardrobeItems = await fetchClothingItems();
      setItems(wardrobeItems || []);
    } catch (error) {
      console.error('Failed to load wardrobe data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    try {
      setAiLoading(true);
      const insights = await analyzeWardrobe();
      setAiInsights(insights.data);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const getCategoryData = () => {
    const categories = {};
    items.forEach(item => {
      categories[item.subCategory] = (categories[item.subCategory] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const getColorData = () => {
    const colors = {};
    items.forEach(item => {
      colors[item.color] = (colors[item.color] || 0) + 1;
    });
    return Object.entries(colors).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#3b82f6'];

  if (loading) return (
    <div className="loading-container">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="loader"
      />
      <p>Building your fashion dashboard...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="analytics-page"
    >
      <header className="page-header">
        <h1>Style Intelligence</h1>
        <p>Advanced insights into your wardrobe composition and style trends</p>
      </header>
      
      <div className="stats-grid">
        <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
          <div className="stat-icon-wrapper purple"><FaTshirt /></div>
          <div className="stat-info">
            <h3>Total Items</h3>
            <div className="stat-value">{items.length}</div>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
          <div className="stat-icon-wrapper emerald"><FaFire /></div>
          <div className="stat-info">
            <h3>Avg Drip Score</h3>
            <div className="stat-value">
              {Math.round(items.reduce((sum, item) => sum + (item.dripScore || 0), 0) / items.length || 0)}
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="stat-card glass-card">
          <div className="stat-icon-wrapper ocean"><FaLeaf /></div>
          <div className="stat-info">
            <h3>Sustainability</h3>
            <div className="stat-value">Excellent</div>
          </div>
        </motion.div>
      </div>

      <div className="analytics-content-grid">
        <div className="main-charts">
          <div className="chart-card glass-card">
            <div className="chart-header">
              <FaChartPie />
              <h3>Category Distribution</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card glass-card">
            <div className="chart-header">
              <FaChartBar />
              <h3>Color Palette</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getColorData()}>
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {getColorData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="ai-insights-sidebar thin-scrollbar">
          <div className="insights-card glass-card">
            <div className="insights-header">
              <FaLightbulb className="icon-glow" />
              <h3>AI Style Consultant</h3>
            </div>
            
            <AnimatePresence mode="wait">
              {aiLoading ? (
                <motion.div 
                  key="ai-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ai-loading-placeholder"
                >
                  <div className="shimmer-line"></div>
                  <div className="shimmer-line"></div>
                  <div className="shimmer-line"></div>
                  <p>AI is analyzing your style...</p>
                </motion.div>
              ) : aiInsights ? (
                <motion.div 
                  key="ai-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="insights-content"
                >
                  <div className="insight-text">
                    {aiInsights.aiInsights}
                  </div>
                  <div className="recommendations-section">
                    <h4>Smart Recommendations</h4>
                    <ul>
                      {aiInsights.recommendations?.map((rec, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="no-insights">
                  <p>No insights available yet. Add more items to your wardrobe for better analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;