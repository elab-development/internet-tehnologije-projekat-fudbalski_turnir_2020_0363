import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Teams.css';
import NavigationMenu from './NavigationMenu';
const Teams = () => {
  const [teams, setTeams] = useState([]);
  const location = useLocation();
  const { role } = location.state || {}; 




  useEffect(() => {
  
    const fetchTeams = async () => {
      try {
        const config = {
          method: 'get',
          url: 'http://localhost:8000/api/teams',
          headers: { 
            'Authorization':  "Bearer "  + window.sessionStorage.getItem('auth_token')
          }
        };

        const response = await axios.request(config);
        const teamsData = response.data.data.map(team => ({
          id: team.id,
          name: team.name,
          players: team.players.map(player => player.name) // Extract player names
        }));
        setTeams(teamsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeams();
  }, []);




  return (
    <div className="teams-container">
     <NavigationMenu role={role} />
      <h1 className="title">SVI TIMOVI</h1>
      <div className="teams-list">
        {teams.map(team => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <ul className="players-list">
              {team.players.map((player, index) => (
                <li key={index}>{player}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;