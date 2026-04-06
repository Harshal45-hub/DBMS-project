import React from 'react';
import StealThisFit from '../components/Social/StealThisFit';
import './StealThisFitPage.css';

const StealThisFitPage = () => {
  const sampleOutfit = {
    _id: '1',
    items: [
      { _id: '1', name: 'Classic White T-Shirt', price: 25, imageUrl: 'https://via.placeholder.com/150' },
      { _id: '2', name: 'Black Jeans', price: 55, imageUrl: 'https://via.placeholder.com/150' },
      { _id: '3', name: 'Sneakers', price: 65, imageUrl: 'https://via.placeholder.com/150' }
    ]
  };

  const handleSteal = (outfit) => {
    alert(`You stole this outfit! Check your wardrobe.`);
  };

  return (
    <div className="steal-page">
      <h1>🔥 Steal This Fit</h1>
      <p>Get inspired by popular outfits from the community</p>
      <div className="steal-container">
        <StealThisFit outfit={sampleOutfit} onSteal={handleSteal} />
      </div>
    </div>
  );
};

export default StealThisFitPage;