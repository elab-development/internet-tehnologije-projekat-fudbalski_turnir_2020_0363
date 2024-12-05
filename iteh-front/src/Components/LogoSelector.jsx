import React from 'react';
import './LogoSelector.css';

const logos = Array.from({ length: 20 }, (_, i) => `/images/logo${i + 1}.png`);

const LogoSelector = ({ onSelect, onClose }) => {
  return (
    <div className="logo-selector-modal">
      <div className="logo-selector-content">
        <button onClick={onClose} className="close-btn">X</button>
        <div className="logo-selector-grid">
          {logos.map((logo, index) => (
            <img 
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              className="logo-selector-img"
              onClick={() => onSelect(logo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSelector;
