import React, { useState } from 'react';
import { castVote } from '../../services/api';
import './VotingButtons.css';

const VotingButtons = ({ itemId }) => {
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (voted || loading) return;
    
    setLoading(true);
    try {
      await castVote({ itemId, voteType });
      setVoted(true);
    } catch (error) {
      console.error('Failed to cast vote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voting-buttons">
      <button 
        className="vote-btn drip" 
        onClick={() => handleVote('drip')}
        disabled={voted}
      >
        🔥 Drip
      </button>
      <button 
        className="vote-btn skip" 
        onClick={() => handleVote('skip')}
        disabled={voted}
      >
        ❌ Skip
      </button>
    </div>
  );
};

export default VotingButtons;