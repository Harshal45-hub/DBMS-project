import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaStar, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';
import { generateOutfit, rateOutfit } from '../services/api';
import OutfitCard from '../components/Outfits/OutfitCard';
import toast from 'react-hot-toast';
import './OutfitGenerator.css';

const OutfitGenerator = () => {
  const [occasion, setOccasion] = useState('casual');
  const [loading, setLoading] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setCurrentOutfit(null);
    setAiExplanation('');
    try {
      const result = await generateOutfit(occasion);
      // Backend returns data: { items, explanation, outfitId }
      if (result && result.items) {
        setCurrentOutfit(result);
        setAiExplanation(result.explanation);
        toast.success('AI has curated your look!', { icon: '✨' });
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('AI is resting. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      await rateOutfit(currentOutfit.outfitId, rating, '');
      toast.success('Rating synchronized!', { icon: '📊' });
    } catch (error) {
      toast.error('Failed to sync rating');
    }
  };

  const occasions = [
    { id: 'casual', label: 'Casual', icon: '👟' },
    { id: 'formal', label: 'Formal', icon: '👔' },
    { id: 'party', label: 'Party', icon: '🎉' },
    { id: 'date', label: 'Date', icon: '🍷' },
    { id: 'work', label: 'Work', icon: '💼' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="outfit-generator-page"
    >
      <header className="generator-header">
        <div className="header-text">
          <h1>AI Outfit Curation</h1>
          <p>Leveraging LLaMA 3.2 to generate the perfect ensemble for any occasion</p>
        </div>
      </header>
      
      <div className="generator-layout">
        <aside className="generator-sidebar glass-card">
          <h3>Select Occasion</h3>
          <div className="occasion-grid">
            {occasions.map(occ => (
              <button 
                key={occ.id}
                className={`occasion-btn ${occasion === occ.id ? 'active' : ''}`}
                onClick={() => setOccasion(occ.id)}
              >
                <span className="occ-icon">{occ.icon}</span>
                <span className="occ-label">{occ.label}</span>
              </button>
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate} 
            disabled={loading}
            className="generate-big-btn pulse-glow"
          >
            {loading ? <FaSyncAlt className="spin" /> : <FaMagic />}
            <span>{loading ? 'Curating...' : 'Generate Outfit'}</span>
          </motion.button>
        </aside>

        <main className="generator-content">
          <AnimatePresence mode="wait">
            {!currentOutfit && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="generator-empty glass-card"
              >
                <div className="magic-reveal">✨</div>
                <h2>Ready for a new look?</h2>
                <p>Choose an occasion and let our AI analyze your wardrobe's compatibility.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="generator-loading"
              >
                <div className="fashion-spinner" />
                <p>Analyzing style patterns...</p>
              </motion.div>
            )}

            {currentOutfit && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="generator-result"
              >
                <div className="ai-insight-panel glass-card">
                  <div className="panel-header">
                    <FaInfoCircle />
                    <h3>Style Reasoning</h3>
                  </div>
                  <p>{aiExplanation}</p>
                </div>

                <div className="outfit-preview-section">
                  <h2>The Selected Ensemble</h2>
                  <div className="outfit-items-grid">
                    {currentOutfit.items?.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <OutfitCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="rating-area glass-card">
                    <h4>How's the drip?</h4>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRate(star)}
                          className={(hoverRating || 0) >= star ? 'active' : ''}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default OutfitGenerator;