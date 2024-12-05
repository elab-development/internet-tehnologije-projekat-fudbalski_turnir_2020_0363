import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Players.css';
import NavigationMenu from './NavigationMenu';
import Pagination from './Pagination';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || null);


  useEffect(() => {
    const fetchPlayers = async (page) => {
      setLoading(true);
  
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/players/cumulative_stats?page=${page}`,
        headers: { 
          'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
        }
      };
  
      axios.request(config)
        .then((response) => {
          setPlayers(response.data.data);
          setTotalPages(response.data.meta.last_page);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    };
  
    if (!role) {
      setRole(location.state?.role || '');  // Postavljanje role ako nije setovano
    }
  
    fetchPlayers(currentPage);
  }, [currentPage, role, location.state]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="players-container">
      <NavigationMenu role={role} />
      <h1>SVI IGRAČI</h1>
      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <div>
          <div className="players-list-2">
            {players.map(player => (
              <div
                key={player.id}
                className="player-card"
              >
                <h3>{player.name}</h3>
                <p>Broj godina: {player.number}</p>
                <div className="player-stats">
                  <p>Golovi: {player.cumulative_stats.broj_golova}</p>
                  <p>Asistencije: {player.cumulative_stats.broj_asistencija}</p>
                  <p>Žuti Kartoni: {player.cumulative_stats.broj_zutih_kartona}</p>
                  <p>Crveni Kartoni: {player.cumulative_stats.broj_crvenih_kartona}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Players;
