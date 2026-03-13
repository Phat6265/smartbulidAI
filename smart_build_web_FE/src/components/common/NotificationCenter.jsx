import React, { createContext, useCallback, useContext, useState } from 'react';
import './NotificationCenter.css';

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

let idCounter = 1;

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const notify = useCallback((type, message) => {
    const id = idCounter++;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const confirm = useCallback(({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
    return new Promise((resolve) => {
      setConfirmState({
        title,
        message,
        confirmText,
        cancelText,
        onResolve: (result) => {
          setConfirmState(null);
          resolve(result);
        }
      });
    });
  }, []);

  const value = {
    notifySuccess: (msg) => notify('success', msg),
    notifyError: (msg) => notify('error', msg),
    notifyInfo: (msg) => notify('info', msg),
    confirm
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div className="confirm-backdrop">
          <div className="confirm-dialog">
            <h3>{confirmState.title}</h3>
            <p>{confirmState.message}</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => confirmState.onResolve(false)}
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => confirmState.onResolve(true)}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

