import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerStatsPopup.css';
import {useLocation } from 'react-router-dom';
import EnterStatsPopup from './EnterStatsPopup';
import MatchDetailsPopup from './MatchDetailsPopup';
import Pusher from 'pusher-js';

const PlayerStatsPopup = ({ id, onClose,matchStatus }) => {
  const [playerStats, setPlayerStats] = useState({
    homeTeam: [],
    awayTeam: [],
    homeName:'',
    awayName:''
  });

  const location = useLocation();
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showPlayerStats, setShowPlayerStats] = useState(true); 
  const [showEnterStatsPopup, setShowEnterStatsPopup] = useState(false);
  const { role } = location.state || {};


  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${id}`, {
          headers: { 
            Authorization: "Bearer " + window.sessionStorage.getItem('auth_token'),
          }
        });
        const data = response.data.data;
        populateStats(data);
      
      } catch (error) {
        console.error("Error fetching player stats:", error);
      }
    };
    fetchPlayerStats();

    const pusher = new Pusher('1ef4a6a15882c25d1174', {
      cluster: 'eu',
      encrypted: true
    });

    const channel = pusher.subscribe('game.' + id);
    channel.bind('match-stats-updated', function(data) {
      fetchPlayerStats();
    });

    return () => {
      pusher.unsubscribe('game.' + id);
     
    };

  }, []);


  const populateStats =  (data) =>{
    console.log(data);
    const homeTeamStats = data.home_team.players.map(player => ({
      name: player.name,
      number: player.number,
      goals: player.player_stats.broj_golova,
      assists: player.player_stats.broj_asistencija,
      yellowCards: player.player_stats.broj_zutih_kartona,
      redCards: player.player_stats.broj_crvenih_kartona,
      shotsOnTarget: player.player_stats.broj_suta_u_ovkir,
      shotsOffTarget: player.player_stats.broj_suta_van_okvira
    }));

    const awayTeamStats = data.away_team.players.map(player => ({
      name: player.name,
      number: player.number,
      goals: player.player_stats.broj_golova,
      assists: player.player_stats.broj_asistencija,
      yellowCards: player.player_stats.broj_zutih_kartona,
      redCards: player.player_stats.broj_crvenih_kartona,
      shotsOnTarget: player.player_stats.broj_suta_u_ovkir,
      shotsOffTarget: player.player_stats.broj_suta_van_okvira
    }));

    setPlayerStats({
      homeTeam: homeTeamStats,
      awayTeam: awayTeamStats,
      homeName:data.home_team.name,
      awayName:data.away_team.name
    });
  }


// Handle clicking "Statistika Meča"
const handleMatchStats = () => {
  setShowMatchDetails(true);
  setShowPlayerStats(false);
};

// Handle clicking "Statistika Igrača"
const handlePlayerStats = () => {
  setShowMatchDetails(false);
  setShowPlayerStats(true);
};

const handleEnterStats = () => {
  setShowEnterStatsPopup(true);
};


if (showEnterStatsPopup) {
  return <EnterStatsPopup id={id} onClose={() => setShowEnterStatsPopup(false)}  />;
}



if (showMatchDetails) {
  return <MatchDetailsPopup id={id} onClose={onClose} />;
}



  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="player-stats">
          <h3 className="team-title">{playerStats.homeName}</h3>
          <div className="player-list">
            {playerStats.homeTeam.map((player, index) => (
              <div key={index} className="player-item">
                <div className="player-name">{player.name} (Broj: {player.number})</div>
                <div className="player-stats-detail">
                  <div>Broj golova: {player.goals}</div>
                  <div>Broj asistencija: {player.assists}</div>
                  <div>Broj žutih kartona: {player.yellowCards}</div>
                  <div>Broj crvenih kartona: {player.redCards}</div>
                  <div>Šutevi u okvir: {player.shotsOnTarget}</div>
                  <div>Šutevi van okvira: {player.shotsOffTarget}</div>
                </div>
              </div>
            ))}
          </div>
        <h3 className="team-title">{playerStats.awayName}</h3>
          <div className="player-list">
            {playerStats.awayTeam.map((player, index) => (
              <div key={index} className="player-item">
                <div className="player-name">{player.name} (Broj: {player.number})</div>
                <div className="player-stats-detail">
                  <div>Broj golova: {player.goals}</div>
                  <div>Broj asistencija: {player.assists}</div>
                  <div>Broj žutih kartona: {player.yellowCards}</div>
                  <div>Broj crvenih kartona: {player.redCards}</div>
                  <div>Šutevi u okvir: {player.shotsOnTarget}</div>
                  <div>Šutevi van okvira: {player.shotsOffTarget}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="popup-buttons">
          <button className="stat-btn" onClick={handleMatchStats}>Statistika Meča</button>
          <button className="stat-btn" onClick={handlePlayerStats}>Statistika Igrača</button>
          {role === 'admin' && matchStatus==='in_progress' && (
            <button className="stat-btn" onClick={handleEnterStats}>Unesi Statistiku</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsPopup;
