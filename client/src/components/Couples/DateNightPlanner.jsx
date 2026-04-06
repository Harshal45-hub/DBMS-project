import React, { useState } from 'react';
import { planDateNight } from '../../services/api';
import './DateNightPlanner.css';

const DateNightPlanner = () => {
  const [occasion, setOccasion] = useState('romantic');
  const [location, setLocation] = useState('restaurant');
  const [weather, setWeather] = useState('pleasant');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const occasions = ['romantic', 'casual', 'adventurous', 'elegant'];
  const locations = ['restaurant', 'movie', 'park', 'beach', 'concert'];
  const weatherOptions = ['sunny', 'rainy', 'cold', 'pleasant', 'windy'];

  const handlePlan = async () => {
    setLoading(true);
    try {
      const result = await planDateNight({ occasion, location, weather });
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to plan date night:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="date-night-planner">
      <h3>Date Night Planner</h3>
      
      <div className="planner-controls">
        <div className="control-group">
          <label>Vibe</label>
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            {occasions.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Weather</label>
          <select value={weather} onChange={(e) => setWeather(e.target.value)}>
            {weatherOptions.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        
        <button onClick={handlePlan} disabled={loading} className="btn-primary">
          {loading ? 'Planning...' : 'Plan My Date Night'}
        </button>
      </div>
      
      {suggestions && (
        <div className="suggestions">
          <div className="outfit-suggestion">
            <h4>👔 Outfit Suggestion</h4>
            <p>{suggestions.outfitSuggestion}</p>
          </div>
          
          <div className="gift-suggestions">
            <h4>🎁 Gift Ideas</h4>
            {suggestions.giftSuggestions?.map((gift, idx) => (
              <div key={idx} className="gift-item">
                <strong>{gift.type}</strong> - {gift.color} - ${gift.price}
                <p className="gift-reason">{gift.reason}</p>
              </div>
            ))}
          </div>
          
          <div className="tips">
            <h4>💡 Styling Tips</h4>
            <ul>
              {suggestions.tips?.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateNightPlanner;