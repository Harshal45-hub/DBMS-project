import React, { useState, useEffect } from 'react';
import ReelFeed from '../components/Social/ReelFeed';
import './ReelFeedPage.css';

const ReelFeedPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for reels
    const mockReels = [
      {
        _id: '1',
        title: 'Summer Vibes',
        description: 'Check out this amazing summer outfit!',
        videoUrl: '',
        imageUrl: 'https://via.placeholder.com/400x600',
        likes: 1234,
        comments: 89
      },
      {
        _id: '2',
        title: 'Casual Look',
        description: 'Perfect for a day out',
        videoUrl: '',
        imageUrl: 'https://via.placeholder.com/400x600',
        likes: 2345,
        comments: 156
      }
    ];
    setReels(mockReels);
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading reels...</div>;

  return (
    <div className="reel-page">
      <ReelFeed outfits={reels} />
    </div>
  );
};

export default ReelFeedPage;