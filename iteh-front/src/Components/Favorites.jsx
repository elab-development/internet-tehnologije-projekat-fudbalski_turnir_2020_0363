import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Favorites.css';
import NavigationMenu from './NavigationMenu';

const Favorites = () => {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {}; 

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8000/api/tournaments/favorites',
          headers: { 
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
          },
        };
        const response = await axios.request(config);
        setTournaments(response.data.data);
        
      } catch (error) {
        console.error("There was an error fetching the tournaments!", error);
      }
    };

    fetchTournaments();
  }, []);


  const handleFavoriteClick = async (id, isFavorite,event) => {
    try {
      event.stopPropagation();
      const config = {
        method: isFavorite ? 'delete' : 'post',
        url: `http://localhost:8000/api/tournaments/favorites/${id}`,
        headers: { 
          'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
        },
      };
      await axios.request(config);

      
      setTournaments(prevTournaments =>
        prevTournaments.filter(tournament => tournament.id !== id)
      );
    } catch (error) {
      console.error("There was an error updating the favorite status!", error);
    }
  };


  const handleTournamentClick = (tournament) => {
    console.log(tournament);
    navigate(`/matches/${tournament.id}` , {state: { role }});
  };



  return (
    <div className="tournaments-container">
     <NavigationMenu role={role} />
      <h2>Moji omiljeni turniri</h2>
      <div className="tournaments-list">
        {tournaments.map(tournament => (
        <div 
            key={tournament.id} 
            className="tournament-card"
            onClick={() => handleTournamentClick(tournament)}
          >
            <img 
              src={tournament.logo} 
              alt={tournament.name} 
              className="tournament-logo" 
            />
            <h3>{tournament.name}</h3>
            <p>Lokacija: {tournament.place}</p>
            <p>Broj Timova: {tournament.teams}</p>
           {role==='user' && <span 
              className={`favorite-star ${tournament.isFavorite ? 'favorite' : ''}`} 
              onClick={(event) => handleFavoriteClick(tournament.id, tournament.isFavorite, event)}
            >
              &#9733;
            </span>} 
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
