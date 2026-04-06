import React from 'react';
import './Toast.css';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="toast-close">
              ×
            </button>
          </div>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};

export default Toast;