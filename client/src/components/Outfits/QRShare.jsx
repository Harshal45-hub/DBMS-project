import React, { useState, useRef } from 'react';
import { FaDownload, FaShareAlt, FaTimes } from 'react-icons/fa';
import './QRShare.css';

const QRShare = ({ outfitId, outfitName }) => {
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef(null);
  const shareUrl = `${window.location.origin}/shared/outfit/${outfitId}`;

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Draw black squares (simplified QR pattern)
    ctx.fillStyle = '#000000';
    
    // Draw position markers (corners)
    const drawSquare = (x, y, s) => {
      ctx.fillRect(x, y, s, s);
    };
    
    // Top-left marker
    drawSquare(10, 10, 30);
    drawSquare(15, 15, 20);
    ctx.fillStyle = '#FFFFFF';
    drawSquare(20, 20, 10);
    ctx.fillStyle = '#000000';
    
    // Draw random pattern (this is just a placeholder)
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i * j) % 7 === 0) {
          ctx.fillRect(50 + i * 7, 50 + j * 7, 4, 4);
        }
      }
    }
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';
    ctx.fillText(outfitName || 'Outfit', 70, 180);
  };

  React.useEffect(() => {
    if (showQR) {
      setTimeout(generateQRCode, 100);
    }
  }, [showQR]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `outfit-${outfitId || 'share'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="qr-share">
      <button className="share-outfit-btn" onClick={() => setShowQR(!showQR)}>
        <FaShareAlt /> Share Outfit
      </button>
      
      {showQR && (
        <div className="qr-modal" onClick={() => setShowQR(false)}>
          <div className="qr-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-header">
              <h3>Share This Outfit</h3>
              <button className="close-qr-btn" onClick={() => setShowQR(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="qr-code-container">
              <canvas ref={canvasRef} width="200" height="200" style={{ width: '200px', height: '200px' }} />
            </div>
            
            {outfitName && (
              <p className="qr-outfit-name">{outfitName}</p>
            )}
            
            <p className="qr-url">{shareUrl}</p>
            
            <div className="qr-actions">
              <button onClick={downloadQR} className="qr-btn">
                <FaDownload /> Download QR
              </button>
              <button onClick={copyToClipboard} className="qr-btn">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRShare;