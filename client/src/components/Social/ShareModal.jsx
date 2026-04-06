import React, { useState } from 'react';
import { createShareLink } from '../../services/api';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, wardrobeId }) => {
  const [permissions, setPermissions] = useState({
    view: true,
    suggest: true,
    comment: true,
    vote: true
  });
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await createShareLink({ permissions, wardrobeId });
      setShareUrl(result.shareUrl);
    } catch (error) {
      console.error('Failed to create share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Share Your Wardrobe</h3>
        
        {!shareUrl ? (
          <>
            <div className="permissions-section">
              <h4>Permissions</h4>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.view}
                  onChange={(e) => setPermissions({...permissions, view: e.target.checked})}
                />
                View items
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.suggest}
                  onChange={(e) => setPermissions({...permissions, suggest: e.target.checked})}
                />
                Suggest outfits
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.comment}
                  onChange={(e) => setPermissions({...permissions, comment: e.target.checked})}
                />
                Comment
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.vote}
                  onChange={(e) => setPermissions({...permissions, vote: e.target.checked})}
                />
                Vote (Drip/Skip)
              </label>
            </div>
            
            <button onClick={handleGenerate} disabled={loading} className="btn-primary">
              {loading ? 'Generating...' : 'Generate Share Link'}
            </button>
          </>
        ) : (
          <div className="share-result">
            <p>Your shareable link:</p>
            <div className="share-url">
              <input type="text" value={shareUrl} readOnly />
              <button onClick={copyToClipboard}>Copy</button>
            </div>
            <p className="share-message">
              Share this link with friends and family to get their feedback!
            </p>
          </div>
        )}
        
        <button onClick={onClose} className="close-modal">Close</button>
      </div>
    </div>
  );
};

export default ShareModal;