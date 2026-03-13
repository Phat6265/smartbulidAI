// Input Component
import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  onChange,
  onBlur,
  ...props
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const inputClasses = `
    input
    ${hasError ? 'input--error' : ''}
    ${disabled ? 'input--disabled' : ''}
    ${fullWidth ? 'input--full-width' : ''}
    ${className}
  `.trim();

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;

