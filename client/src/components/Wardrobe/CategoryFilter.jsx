import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ filters, setFilters }) => {
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'upperwear', label: 'Upperwear' },
    { value: 'lowerwear', label: 'Lowerwear' }
  ];
  
  const subCategories = {
    upperwear: ['shirt', 't-shirt', 'goggles'],
    lowerwear: ['jeans', 'pants', 'innerwear']
  };
  
  const occasions = ['casual', 'formal', 'party', 'sport', 'date', 'work', 'travel'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="category-filter">
      <div className="filter-group">
        <label>Category</label>
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`filter-btn ${filters.category === cat.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('category', cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {filters.category !== 'all' && (
        <div className="filter-group">
          <label>Subcategory</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filters.subCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('subCategory', 'all')}
            >
              All
            </button>
            {subCategories[filters.category].map(sub => (
              <button
                key={sub}
                className={`filter-btn ${filters.subCategory === sub ? 'active' : ''}`}
                onClick={() => handleFilterChange('subCategory', sub)}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="filter-group">
        <label>Occasion</label>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filters.occasion === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('occasion', 'all')}
          >
            All
          </button>
          {occasions.map(occ => (
            <button
              key={occ}
              className={`filter-btn ${filters.occasion === occ ? 'active' : ''}`}
              onClick={() => handleFilterChange('occasion', occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;