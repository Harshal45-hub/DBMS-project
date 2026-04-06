import React, { useState, useEffect } from 'react';
import { getSocialFeed, getActiveChallenges } from '../services/api';
import CommentSection from '../components/Social/CommentSection';
import VotingButtons from '../components/Social/VotingButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaTrophy, FaHashtag, FaHeart, FaComment, FaShareAlt, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './SocialHub.css';

const SocialHub = () => {
  const [feed, setFeed] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // High-quality mock data for a "living" feed
  const mockChallenges = [
    {
      _id: 'c1',
      title: 'Monochrome Magic',
      description: 'Create an outfit using only one color Palette. Show us your best tonal looks!',
      endDate: new Date(Date.now() + 86400000 * 3),
      participants: new Array(124).fill(0),
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'
    },
    {
      _id: 'c2',
      title: '90s Streetwear',
      description: 'Throwback to the golden era of baggy jeans and oversized hoodies.',
      endDate: new Date(Date.now() + 86400000 * 5),
      participants: new Array(86).fill(0),
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const mockFeed = [
    {
      _id: 'f1',
      user: { name: 'Elena Style', avatar: '💃' },
      date: new Date(),
      caption: 'Loving this new linen set for the summer! ✨ #SummerVibes #SustainableFashion',
      items: [
        { _id: 'i1', name: 'Linen Shirt', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80' },
        { _id: 'i2', name: 'Beige Trousers', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=150&q=80' }
      ],
      likes: 45,
      comments: 12
    },
    {
      _id: 'f2',
      user: { name: 'Marcus Wong', avatar: '🕶️' },
      date: new Date(Date.now() - 3600000),
      caption: 'Monday morning routine. Dark tones and clean lines. #OfficeStyle #Minimalism',
      items: [
        { _id: 'i3', name: 'Charcoal Blazer', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80' },
        { _id: 'i4', name: 'Black Chelsea Boots', imageUrl: 'https://images.unsplash.com/photo-16353970742a9-d670642142aa?auto=format&fit=crop&w=150&q=80' }
      ],
      likes: 89,
      comments: 24
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedData, challengesData] = await Promise.all([
        getSocialFeed().catch(() => ({ outfits: [] })),
        getActiveChallenges().catch(() => [])
      ]);
      
      // Use mock data if real data is empty
      setFeed(feedData?.outfits?.length > 0 ? feedData.outfits : mockFeed);
      setChallenges(challengesData?.length > 0 ? challengesData : mockChallenges);
    } catch (error) {
      console.error('Failed to load social data:', error);
      setFeed(mockFeed);
      setChallenges(mockChallenges);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id) => {
    setFeed(feed.map(post => 
      post._id === id ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
    toast.success('Liked post!', { icon: '❤️' });
  };

  const handleShare = (id) => {
    toast.success('Link copied to clipboard!', { icon: '🔗' });
  };

  const handleComment = (id) => {
    toast('Comments coming soon!', { icon: '💬' });
  };

  if (loading) return (
    <div className="loading-container">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="loader" />
      <p>Connecting to the fashion community...</p>
    </div>
  );

  return (
    <div className="social-hub">
      <header className="social-header">
        <div className="header-text">
          <h1>Fashion Network</h1>
          <p>Connect, share, and get inspired by the community</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary create-post-btn"
          onClick={() => toast('Post creation coming soon!', { icon: '📝' })}
        >
          <FaPlus /> Share Your Style
        </motion.button>

      </header>
      
      <div className="social-content-layout">
        <div className="main-feed-column">
          <section className="challenges-section">
            <div className="section-title">
              <FaTrophy className="text-orange" />
              <h2>Trending Challenges</h2>
            </div>
            <div className="challenges-scroll thin-scrollbar">
              {challenges.map((challenge, idx) => (
                <motion.div 
                  key={challenge._id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="challenge-card glass-card"
                  style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${challenge.image})` }}
                >
                  <div className="challenge-content">
                    <h3>{challenge.title}</h3>
                    <p>{challenge.description}</p>
                    <div className="challenge-footer">
                      <span className="participants">
                        <FaUsers /> {challenge.participants.length}+
                      </span>
                      <button className="join-btn">Join Now</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="community-feed">
            <div className="section-title">
              <FaHashtag className="text-purple" />
              <h2>Community Feed</h2>
            </div>
            
            <div className="feed-grid">
              {feed.map((post, idx) => (
                <motion.div 
                  key={post._id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="feed-card glass-card"
                >
                  <div className="feed-card-header">
                    <div className="user-profile">
                      <div className="avatar-circle">{post.user?.avatar || '👤'}</div>
                      <div className="user-details">
                        <strong>{post.user?.name || 'Anonymous User'}</strong>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="more-btn">...</button>
                  </div>
                  
                  <div className="feed-card-content">
                    <p className="caption">{post.caption}</p>
                    <div className="outfit-preview">
                      {post.items?.slice(0, 3).map(item => (
                        <div key={item._id} className="item-thumb">
                          <img src={item.imageUrl} alt={item.name} />
                          <div className="item-label">{item.name}</div>
                        </div>
                      ))}
                      {post.items?.length > 3 && (
                        <div className="more-items">+{post.items.length - 3}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="feed-card-footer">
                    <div className="interaction-btns">
                      <button className="action-btn" onClick={() => handleLike(post._id)}>
                        <FaHeart className="text-pink" /> <span>{post.likes || 0}</span>
                      </button>
                      <button className="action-btn" onClick={() => handleComment(post._id)}>
                        <FaComment /> <span>{post.comments || 0}</span>
                      </button>
                    </div>
                    <button className="action-btn share" onClick={() => handleShare(post._id)}>
                      <FaShareAlt />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <aside className="social-sidebar">
          <div className="trending-hashtags glass-card">
            <h3>Trending Now</h3>
            <ul className="hashtag-list">
              <li><span>#SummerStyle</span> <small>2.4k posts</small></li>
              <li><span>#SustainableFashion</span> <small>1.8k posts</small></li>
              <li><span>#OOTD</span> <small>5.6k posts</small></li>
              <li><span>#CleanFit</span> <small>940 posts</small></li>
            </ul>
          </div>

          <div className="top-contributors glass-card">
            <h3>Top Contributors</h3>
            <div className="contributor-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="contributor-item">
                  <div className="mini-avatar">🌟</div>
                  <div className="contributor-info">
                    <strong>StyleMaster_{i}</strong>
                    <span>{120 - i * 10} Outfits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SocialHub;