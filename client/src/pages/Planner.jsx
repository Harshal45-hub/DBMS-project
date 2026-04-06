import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { getPlannedOutfits, scheduleOutfit, getOutfitSuggestionsForDate } from '../services/api';
import { format } from 'date-fns';
import './Planner.css';
import 'react-calendar/dist/Calendar.css';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plannedOutfits, setPlannedOutfits] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [occasion, setOccasion] = useState('casual');

  useEffect(() => {
    loadPlannedOutfits();
    if (selectedDate) {
      loadSuggestions();
    }
  }, [selectedDate]);

  const loadPlannedOutfits = async () => {
    try {
      const outfits = await getPlannedOutfits();
      setPlannedOutfits(outfits);
    } catch (error) {
      console.error('Failed to load planned outfits:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggestions = await getOutfitSuggestionsForDate({
        date: selectedDate.toISOString(),
        occasion
      });
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSchedule = async (suggestion) => {
    try {
      await scheduleOutfit({
        items: suggestion.items.map(i => i._id),
        date: selectedDate,
        occasion,
        notes: suggestion.description
      });
      await loadPlannedOutfits();
      setShowScheduler(false);
      alert('Outfit scheduled successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to schedule outfit');
    }
  };

  const getOutfitForDate = (date) => {
    return plannedOutfits.find(outfit => 
      format(new Date(outfit.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="planner-page">
      <h1>Outfit Planner</h1>
      
      <div className="planner-container">
        <div className="calendar-section">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) => {
              const outfit = getOutfitForDate(date);
              if (outfit && view === 'month') {
                return <div className="outfit-indicator">👕</div>;
              }
              return null;
            }}
          />
        </div>
        
        <div className="date-details">
          <h2>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
          
          {getOutfitForDate(selectedDate) && (
            <div className="scheduled-outfit">
              <h3>Scheduled Outfit</h3>
              <div className="outfit-details">
                {getOutfitForDate(selectedDate).items?.map(item => (
                  <div key={item._id} className="scheduled-item">
                    <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
                <p className="occasion">{getOutfitForDate(selectedDate).occasion}</p>
              </div>
            </div>
          )}
          
          <button 
            className="btn-primary"
            onClick={() => setShowScheduler(!showScheduler)}
          >
            {showScheduler ? 'Cancel' : 'Plan Outfit'}
          </button>
          
          {showScheduler && (
            <div className="scheduler">
              <div className="occasion-selector">
                <label>Occasion:</label>
                <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                  <option value="date">Date</option>
                  <option value="work">Work</option>
                </select>
              </div>
              
              <h3>AI Suggestions</h3>
              <div className="suggestions-list">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="suggestion-card">
                    <div className="suggestion-items">
                      {suggestion.items?.map(item => (
                        <span key={item._id} className="suggestion-item">
                          {item.name}
                        </span>
                      ))}
                    </div>
                    <p className="suggestion-desc">{suggestion.description}</p>
                    <div className="compatibility">
                      Compatibility: {suggestion.compatibility}%
                    </div>
                    <button 
                      onClick={() => handleSchedule(suggestion)}
                      className="btn-secondary"
                    >
                      Schedule This
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;