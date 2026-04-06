import React from 'react';
import './OutfitCard.css';

const OutfitCard = ({ item }) => {
  return (
    <div className="outfit-card">
      <div className="outfit-image">
        <img src={item.imageUrl || '/placeholder.jpg'} alt={item.name} />
      </div>
      <div className="outfit-info">
        <h4>{item.name}</h4>
        <p className="color">{item.color}</p>
        <div className="outfit-badges">
          <span className="badge">{item.subCategory}</span>
          {item.dripScore > 80 && <span className="badge hot">🔥 Hot</span>}
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;