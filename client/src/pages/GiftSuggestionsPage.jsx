import React from 'react';
import GiftSuggestions from '../components/Couples/GiftSuggestions';
import './GiftSuggestionsPage.css';

const GiftSuggestionsPage = () => {
  const partnerId = 'partner-123';

  return (
    <div className="gift-page">
      <h1>🎁 Gift Ideas</h1>
      <p>Discover the perfect gifts for your loved ones</p>
      <GiftSuggestions partnerId={partnerId} />
    </div>
  );
};

export default GiftSuggestionsPage;