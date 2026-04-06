import React, { useState } from 'react';
import { pairWardrobes } from '../../services/api';
import './CouplePairing.css';

const CouplePairing = () => {
  const [partnerToken, setPartnerToken] = useState('');
  const [pairingResult, setPairingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePair = async () => {
    if (!partnerToken.trim()) return;
    
    setLoading(true);
    try {
      const result = await pairWardrobes({ partnerToken });
      setPairingResult(result);
    } catch (error) {
      alert('Failed to pair wardrobes. Check the token and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="couple-pairing">
      <h3>Connect with Your Partner</h3>
      <p>Enter your partner's wardrobe share token to connect and get couple outfit suggestions!</p>
      
      <div className="pairing-input">
        <input
          type="text"
          placeholder="Enter partner's share token"
          value={partnerToken}
          onChange={(e) => setPartnerToken(e.target.value)}
        />
        <button onClick={handlePair} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
      
      {pairingResult && (
        <div className="pairing-success">
          <h4>🎉 Connected Successfully!</h4>
          <p>Your couple token: <strong>{pairingResult.coupleToken}</strong></p>
          <p>Share this with your partner to stay connected.</p>
        </div>
      )}
    </div>
  );
};

export default CouplePairing;