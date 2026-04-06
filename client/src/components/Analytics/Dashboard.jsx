import React, { useState, useEffect } from 'react';
import { getDashboardStats, getStyleTrends, getSustainabilityMetrics } from '../../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState(null);
  const [sustainability, setSustainability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, trendsData, sustainabilityData] = await Promise.all([
        getDashboardStats(),
        getStyleTrends(),
        getSustainabilityMetrics()
      ]);
      setStats(statsData);
      setTrends(trendsData);
      setSustainability(sustainabilityData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec489a'];

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sustainability' ? 'active' : ''}`}
            onClick={() => setActiveTab('sustainability')}
          >
            Sustainability
          </button>
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="overview-tab">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👕</div>
              <div className="stat-info">
                <h3>Total Items</h3>
                <p className="stat-value">{stats.overview?.totalItems || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✨</div>
              <div className="stat-info">
                <h3>Total Outfits</h3>
                <p className="stat-value">{stats.overview?.totalOutfits || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💎</div>
              <div className="stat-info">
                <h3>Avg Drip Score</h3>
                <p className="stat-value">{stats.overview?.averageDripScore || 0}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-info">
                <h3>Most Worn</h3>
                <p className="stat-value">{stats.usage?.mostWorn[0]?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Items by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.distribution?.byCategory || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(stats.distribution?.byCategory || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Items by Color</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.distribution?.byColor || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="ai-insights">
            <h3>🤖 AI Insights</h3>
            <p>{stats.aiInsights || 'Analyzing your wardrobe...'}</p>
          </div>

          <div className="usage-section">
            <h3>Most Worn Items</h3>
            <div className="usage-list">
              {stats.usage?.mostWorn?.map((item, idx) => (
                <div key={idx} className="usage-item">
                  <span className="rank">{idx + 1}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="wear-count">{item.timesWorn} wears</span>
                  <div className="wear-progress">
                    <div 
                      className="wear-progress-bar" 
                      style={{ width: `${Math.min(100, (item.timesWorn / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cost-analysis">
            <h3>Cost Per Wear Analysis</h3>
            <div className="cost-list">
              {stats.usage?.costPerWear?.slice(0, 5).map((item, idx) => (
                <div key={idx} className="cost-item">
                  <span>{item.name}</span>
                  <span className="cost-value">${item.costPerWear}/wear</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && trends && (
        <div className="trends-tab">
          <div className="trends-header">
            <h3>Style Trends Analysis</h3>
            <p className="trends-date">Last 30 days</p>
          </div>

          <div className="trends-insights">
            <div className="insight-card">
              <h4>Popular Categories</h4>
              <div className="category-trends">
                {trends.popularCategories?.map((cat, idx) => (
                  <div key={idx} className="trend-item">
                    <span className="trend-name">{cat[0]}</span>
                    <div className="trend-bar-container">
                      <div 
                        className="trend-bar" 
                        style={{ width: `${Math.min(100, (cat[1] / (trends.popularCategories[0]?.[1] || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="trend-count">{cat[1]} wears</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-card">
              <h4>Color Trends</h4>
              <div className="color-trends">
                {trends.popularColors?.map((color, idx) => (
                  <div key={idx} className="color-trend-item">
                    <div 
                      className="color-dot" 
                      style={{ backgroundColor: color[0] }}
                    />
                    <span className="color-name">{color[0]}</span>
                    <div className="color-bar-container">
                      <div 
                        className="color-bar" 
                        style={{ 
                          width: `${Math.min(100, (color[1] / (trends.popularColors[0]?.[1] || 1)) * 100)}%`,
                          backgroundColor: color[0]
                        }}
                      />
                    </div>
                    <span className="color-count">{color[1]} wears</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-analysis">
              <h4>🤖 AI Trend Analysis</h4>
              <p>{trends.aiAnalysis || 'Analyzing trends...'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sustainability' && sustainability && (
        <div className="sustainability-tab">
          <div className="sustainability-score">
            <div className="score-circle">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--bg-tertiary)"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="12"
                  strokeDasharray={`${(sustainability.sustainabilityScore || 0) * 3.4} 340`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="70" textAnchor="middle" fontSize="24" fill="var(--text-primary)">
                  {sustainability.sustainabilityScore || 0}
                </text>
                <text x="60" y="90" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
                  Score
                </text>
              </svg>
            </div>
            <div className="score-info">
              <h3>Sustainability Score</h3>
              <p>Based on how often you wear your items</p>
            </div>
          </div>

          <div className="sustainability-metrics">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <h4>Average Wears Per Item</h4>
                <p className="metric-value">{sustainability.averageWearsPerItem || 0}</p>
                <p className="metric-trend">
                  {sustainability.averageWearsPerItem > 20 ? '👍 Good' : '👎 Could improve'}
                </p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🔄</div>
              <div className="metric-content">
                <h4>Total Wears</h4>
                <p className="metric-value">{sustainability.totalWears || 0}</p>
                <p className="metric-sub">lifetime wears</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌍</div>
              <div className="metric-content">
                <h4>CO₂ Saved</h4>
                <p className="metric-value">~{(sustainability.totalWears * 0.5).toFixed(0)}kg</p>
                <p className="metric-sub">compared to fast fashion</p>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h3>💡 Recommendations</h3>
            <ul className="recommendations-list">
              {sustainability.recommendations?.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
              <li>Consider hosting a clothing swap event with friends</li>
              <li>Try to wear each item at least 30 times before replacing</li>
              <li>Explore sustainable fashion brands for your next purchase</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;