import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationButtons.css';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button onClick={() => navigate('/premier-league')}>
        Premier League Standings
      </button>
      <button onClick={() => navigate('/premier-league/matches')}>
        Premier League Matches
      </button>
    </div>
  );
};

export default NavigationButtons;
