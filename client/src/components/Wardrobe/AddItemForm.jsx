import React, { useState } from 'react';
import { createClothingItem, uploadImage } from '../../services/api';
import './AddItemForm.css';

const AddItemForm = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'upperwear',
    subCategory: 't-shirt',
    color: '',
    occasion: [],
    tags: [],
    price: 0,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = {
    upperwear: ['shirt', 't-shirt', 'goggles'],
    lowerwear: ['jeans', 'pants', 'innerwear']
  };

  const occasions = ['casual', 'formal', 'party', 'sport', 'date', 'work', 'travel'];
  const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOccasionToggle = (occasion) => {
    setFormData(prev => ({
      ...prev,
      occasion: prev.occasion.includes(occasion)
        ? prev.occasion.filter(o => o !== occasion)
        : [...prev.occasion, occasion]
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const itemToSubmit = { ...formData, imageUrl: finalImageUrl };
      const newItem = await createClothingItem(itemToSubmit);
      onItemAdded(newItem);
      
      setFormData({
        name: '',
        category: 'upperwear',
        subCategory: 't-shirt',
        color: '',
        occasion: [],
        tags: [],
        price: 0,
        imageUrl: ''
      });
      setImageFile(null);
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <h3>Add New Clothing Item</h3>
      
      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Classic White T-Shirt"
        />
      </div>

      <div className="form-group">
        <label>Photo</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR paste an Image URL</span>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            required={!imageFile}
            disabled={!!imageFile}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="upperwear">Upperwear</option>
            <option value="lowerwear">Lowerwear</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Subcategory *</label>
          <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
            {categories[formData.category].map(sub => (
              <option key={sub} value={sub}>{sub.charAt(0).toUpperCase() + sub.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Color *</label>
          <select name="color" value={formData.color} onChange={handleChange} required>
            <option value="">Select color</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Occasions</label>
        <div className="occasion-tags">
          {occasions.map(occ => (
            <button
              key={occ}
              type="button"
              className={`occasion-tag ${formData.occasion.includes(occ) ? 'active' : ''}`}
              onClick={() => handleOccasionToggle(occ)}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>
      
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Adding...' : 'Add to Wardrobe'}
      </button>
    </form>
  );
};

export default AddItemForm;