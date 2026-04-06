import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/aiService';
import { FaPaperPlane, FaRobot, FaTimes, FaCompress, FaExpand, FaMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "👋 Hello! I'm your AI fashion assistant. I can help you with outfit ideas, style advice, and wardrobe suggestions. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(currentInput);
      
      const assistantMessage = {
        role: 'assistant',
        content: response?.response || response?.data?.response || "I'm here to help with your fashion needs!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "⚠️ Sorry, I'm having trouble connecting to the AI brain.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            key="toggle"
            className="chatbot-toggle-bubble" 
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1, translateY: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <FaRobot className="toggle-icon-large" />
            <div className="pulse-ring"></div>
            <div className="tooltip">Ask AI Assistant</div>
          </motion.button>
        )}

        {isOpen && (
          <motion.div 
            key="window"
            className={`chatbot-window glass-card ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="header-left">
                <div className="ai-avatar-glow">
                  <FaRobot />
                </div>
                <div className="header-info">
                  <h3>AI Assistant</h3>
                  <div className="status-indicator">
                    <span className="dot"></span>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={() => setIsMinimized(!isMinimized)} className="header-btn">
                  {isMinimized ? <FaExpand /> : <FaMinus />}
                </button>
                <button onClick={() => setIsOpen(false)} className="header-btn close-btn">
                  <FaTimes />
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                <div className="chatbot-messages">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`message-group ${msg.role}`}>
                      <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                        {msg.content}
                      </div>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {loading && (
                    <div className="message-group assistant">
                      <div className="message-bubble loading">
                        <div className="typing-dots">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="chatbot-input-area">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    disabled={loading}
                  />
                  <button onClick={handleSend} disabled={loading || !input.trim()} className="send-btn">
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;