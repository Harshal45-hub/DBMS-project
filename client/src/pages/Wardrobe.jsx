import React, { useState, useEffect } from 'react';
import ClothingCard from '../components/Wardrobe/ClothingCard';
import AddItemForm from '../components/Wardrobe/AddItemForm';
import CategoryFilter from '../components/Wardrobe/CategoryFilter';
import { fetchClothingItems, deleteItem } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaTshirt } from 'react-icons/fa';
import './Wardrobe.css';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    subCategory: 'all',
    occasion: 'all'
  });

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchClothingItems(filters);
      setItems(data);
    } catch (error) {
      toast.error('Failed to load wardrobe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item._id !== id));
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleItemAdded = (newItem) => {
    setItems([newItem, ...items]);
    setShowAddForm(false);
    toast.success('Item added to wardrobe!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="wardrobe-page"
    >
      <header className="page-header">
        <div className="header-text">
          <h1>My Collection</h1>
          <p>Curate your personal style and track your wardrobe's evolution</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`add-item-btn ${showAddForm ? 'active' : ''}`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <FaTimes /> : <FaPlus />}
          <span>{showAddForm ? 'Close' : 'Add New Item'}</span>
        </motion.button>
      </header>

      <section className="filter-section glass-card">
        <CategoryFilter filters={filters} setFilters={setFilters} />
      </section>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="add-item-form-container overflow-hidden"
          >
            <div className="form-inner glass-card">
              <AddItemForm onItemAdded={handleItemAdded} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="wardrobe-content">
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card glass-card"></div>
            ))}
          </div>
        ) : (
          <div className="wardrobe-grid">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="empty-wardrobe glass-card"
                >
                  <div className="empty-icon"><FaTshirt /></div>
                  <h3>Your collection is empty</h3>
                  <p>Start your fashion journey by adding your first item!</p>
                  <button className="btn-primary" onClick={() => setShowAddForm(true)}>
                    Add Item Now
                  </button>
                </motion.div>
              ) : (
                items.map(item => (
                  <ClothingCard 
                    key={item._id} 
                    item={item} 
                    onDelete={handleDelete}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default Wardrobe;