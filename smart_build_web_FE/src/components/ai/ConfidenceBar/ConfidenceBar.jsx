// Confidence Bar Component for AI Recognition
import React from 'react';
import './ConfidenceBar.css';

const ConfidenceBar = ({ confidence, label, showLabel = true, className = '' }) => {
  const percentage = Math.round(confidence * 100);
  const isHighConfidence = confidence >= 0.7;
  const isMediumConfidence = confidence >= 0.5 && confidence < 0.7;
  const isLowConfidence = confidence < 0.5;

  const getConfidenceClass = () => {
    if (isHighConfidence) return 'confidence-bar--high';
    if (isMediumConfidence) return 'confidence-bar--medium';
    return 'confidence-bar--low';
  };

  return (
    <div className={`confidence-bar ${className}`}>
      {showLabel && label && (
        <div className="confidence-bar-header">
          <span className="confidence-bar-label">{label}</span>
          <span className="confidence-bar-percentage">{percentage}%</span>
        </div>
      )}
      <div className="confidence-bar-container">
        <div
          className={`confidence-bar-fill ${getConfidenceClass()}`}
          style={{ width: `${percentage}%` }}
        >
          <span className="confidence-bar-text">{percentage}%</span>
        </div>
      </div>
      {!showLabel && (
        <div className="confidence-bar-footer">
          <span className="confidence-bar-status">
            {isHighConfidence && 'Độ tin cậy cao'}
            {isMediumConfidence && 'Độ tin cậy trung bình'}
            {isLowConfidence && 'Độ tin cậy thấp'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceBar;

