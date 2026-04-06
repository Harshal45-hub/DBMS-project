import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShareAlt } from 'react-icons/fa';
import './ReelFeed.css';

const ReelFeed = ({ outfits }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    const index = Math.round(e.target.scrollTop / window.innerHeight);
    if (index !== currentIndex && index >= 0 && index < outfits.length) {
      setCurrentIndex(index);
    }
  };

  const handleLike = (outfitId) => {
    setLiked(prev => ({ ...prev, [outfitId]: !prev[outfitId] }));
  };

  if (!outfits || outfits.length === 0) {
    return (
      <div className="reel-feed-empty">
        <p>No reels available yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="reel-feed" ref={containerRef} onScroll={handleScroll}>
      {outfits.map((outfit, idx) => (
        <div key={outfit._id || idx} className="reel-item">
          {outfit.videoUrl ? (
            <video 
              className="reel-video"
              src={outfit.videoUrl}
              autoPlay={idx === currentIndex}
              loop
              muted
              playsInline
            />
          ) : (
            <div className="reel-placeholder">
              <img src={outfit.imageUrl || '/placeholder.jpg'} alt={outfit.title} />
            </div>
          )}
          <div className="reel-overlay">
            <div className="reel-info">
              <h3>{outfit.title || 'Fashion Reel'}</h3>
              <p>{outfit.description || 'Check out this style!'}</p>
            </div>
            <div className="reel-actions">
              <button onClick={() => handleLike(outfit._id)} className="reel-action">
                <FaHeart className={liked[outfit._id] ? 'liked' : ''} />
                <span>{outfit.likes + (liked[outfit._id] ? 1 : 0)}</span>
              </button>
              <button className="reel-action">
                <FaComment />
                <span>{outfit.comments || 0}</span>
              </button>
              <button className="reel-action">
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelFeed;