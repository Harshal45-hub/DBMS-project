import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedWardrobe, submitSuggestion } from '../services/api';
import CommentSection from '../components/Social/CommentSection';
import VotingButtons from '../components/Social/VotingButtons';
import './SharedWardrobe.css';

const SharedWardrobe = () => {
  const { token } = useParams();
  const [wardrobe, setWardrobe] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedWardrobe();
  }, [token]);

  const loadSharedWardrobe = async () => {
    try {
      const data = await getSharedWardrobe(token);
      setWardrobe(data.items);
      setPermissions(data.permissions);
    } catch (error) {
      console.error('Failed to load shared wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    try {
      await submitSuggestion({
        token,
        suggestion: suggestion,
        type: 'suggestion'
      });
      setSuggestion('');
      alert('Suggestion submitted!');
    } catch (error) {
      alert('Failed to submit suggestion');
    }
  };

  if (loading) return <div className="loading">Loading shared wardrobe...</div>;

  if (!wardrobe || wardrobe.length === 0) {
    return (
      <div className="shared-wardrobe-empty">
        <h2>No items to display</h2>
        <p>This wardrobe is empty or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="shared-wardrobe">
      <div className="shared-header">
        <h1>Shared Wardrobe</h1>
        {permissions && (
          <div className="permissions-badge">
            {permissions.suggest && 'Can suggest • '}
            {permissions.comment && 'Can comment • '}
            {permissions.vote && 'Can vote'}
          </div>
        )}
      </div>
      
      <div className="wardrobe-grid">
        {wardrobe.map(item => (
          <div key={item._id} className="shared-item">
            <div className="item-image">
              <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} />
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="details">{item.color} • {item.subCategory}</p>
              {permissions?.vote && <VotingButtons itemId={item._id} />}
            </div>
            {permissions?.comment && (
              <CommentSection itemId={item._id} type="clothing" />
            )}
          </div>
        ))}
      </div>
      
      {permissions?.suggest && (
        <div className="suggestion-form">
          <h3>Suggest an Outfit</h3>
          <form onSubmit={handleSubmitSuggestion}>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Suggest a combination or style idea..."
              rows="3"
            />
            <button type="submit" className="btn-primary">Submit Suggestion</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SharedWardrobe;