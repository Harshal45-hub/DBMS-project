import React, { useState, useEffect } from 'react';
import { getPartnerGiftSuggestions } from '../../services/api';
import { FaGift, FaHeart } from 'react-icons/fa';
import './GiftSuggestions.css';

const GiftSuggestions = ({ partnerId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [partnerId]);

  const loadSuggestions = async () => {
    try {
      const data = await getPartnerGiftSuggestions(partnerId);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to load gift suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="gift-loading">Finding perfect gifts...</div>;

  return (
    <div className="gift-suggestions">
      <h3><FaHeart /> Gift Ideas for Your Partner</h3>
      <div className="gifts-grid">
        {suggestions.map((gift, idx) => (
          <div key={idx} className="gift-card">
            <div className="gift-icon"><FaGift /></div>
            <h4>{gift.type}</h4>
            <p className="gift-color">Color: {gift.color}</p>
            <p className="gift-reason">{gift.reason}</p>
            <p className="gift-price">${gift.price}</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftSuggestions;