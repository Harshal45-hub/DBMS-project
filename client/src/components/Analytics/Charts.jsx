import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

export const CategoryChart = ({ data }) => {
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="chart-wrapper">
      <h3>Category Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const WearFrequencyChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <h3>Wear Frequency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="timesWorn" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <h3>Style Trends Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="casual" stroke="#4f46e5" />
          <Line type="monotone" dataKey="formal" stroke="#10b981" />
          <Line type="monotone" dataKey="party" stroke="#f59e0b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ColorDistributionChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <h3>Color Distribution</h3>
      <div className="color-distribution">
        {data.map((color, idx) => (
          <div key={idx} className="color-item">
            <div 
              className="color-sample" 
              style={{ backgroundColor: color.name }}
            />
            <span className="color-name">{color.name}</span>
            <span className="color-count">{color.value} items</span>
            <div className="color-bar">
              <div 
                className="color-bar-fill" 
                style={{ 
                  width: `${(color.value / Math.max(...data.map(d => d.value))) * 100}%`,
                  backgroundColor: color.name
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CostPerWearChart = ({ data }) => {
  return (
    <div className="chart-wrapper">
      <h3>Cost Per Wear Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="costPerWear" fill="#10b981">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.costPerWear > 20 ? '#ef4444' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};