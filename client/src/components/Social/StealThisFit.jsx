import React from 'react';
import { FaCopy, FaShareAlt } from 'react-icons/fa';
import './StealThisFit.css';

const StealThisFit = ({ outfit, onSteal }) => {
  return (
    <div className="steal-this-fit">
      <div className="steal-header">
        <h3>🔥 Steal This Fit</h3>
        <button className="steal-btn" onClick={() => onSteal(outfit)}>
          <FaCopy /> Steal This Look
        </button>
      </div>
      <div className="steal-items">
        {outfit.items?.map(item => (
          <div key={item._id} className="steal-item">
            <img src={item.imageUrl} alt={item.name} />
            <div className="steal-item-info">
              <p className="steal-item-name">{item.name}</p>
              <p className="steal-item-price">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="share-steal-btn">
        <FaShareAlt /> Share This Look
      </button>
    </div>
  );
};

export default StealThisFit;