import React, { useState, useEffect } from 'react';
import { addComment, getComments } from '../../services/api';
import './CommentSection.css';

const CommentSection = ({ itemId, type = 'clothing' }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [itemId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(itemId);
      setComments(data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = {
        clothingItemId: type === 'clothing' ? itemId : undefined,
        outfitId: type === 'outfit' ? itemId : undefined,
        content: newComment,
        userName: userName || 'Anonymous',
        type: 'comment'
      };
      
      await addComment(commentData);
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  if (loading) {
    return <div className="comment-section-loading">Loading comments...</div>;
  }

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="comment-name"
        />
        <div className="comment-input-group">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </div>
      </form>
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <strong>{comment.userName || 'Anonymous'}</strong>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.content}</p>
              {comment.type === 'vote' && (
                <span className={`vote-badge ${comment.vote}`}>
                  {comment.vote === 'drip' ? '🔥 Drip' : '❌ Skip'}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;