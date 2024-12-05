// NavigationMenu.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationMenu = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.sessionStorage.setItem('auth_token', null);
    navigate('/');
  };

  return (
    <nav className="navigation">
      <ul>
        {role === 'admin' && <li><Link to="/create-tournament" state={{ role }}>Napravi novi turnir</Link></li>}
        <li><Link to="/tournaments" state={{ role }}>Pogledaj sve turnire</Link></li>
        <li><Link to="/teams" state={{ role }}>Pogledaj sve ekipe</Link></li>
        <li><Link to="/players" state={{ role }}>Pogledaj sve igrače</Link></li>
        {role === 'user' && <li><Link to="/favourite" state={{ role }}>Omiljeno</Link></li>}
        {role === 'user' && <li><Link to="/premier-league" state={{ role }}>Premier liga</Link></li>}
      </ul>
      <button onClick={handleLogout} className="logout-btn">Odjavi se</button>
    </nav>
  );
};

export default NavigationMenu;
