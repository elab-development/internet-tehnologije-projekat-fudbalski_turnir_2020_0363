import axios from 'axios';
import './MatchDetailsPopup.css';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PlayerStatsPopup from './PlayerStatsPopup';
import EnterStatsPopup from './EnterStatsPopup';

const MatchDetailsPopup = ({ id, onClose }) => {
  const [showMatchDetails, setShowMatchDetails] = useState(true);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [showEnterStatsPopup, setShowEnterStatsPopup] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const location = useLocation();
  const { role } = location.state || {};

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${id}`, {
          headers: { 
            Authorization: "Bearer " + window.sessionStorage.getItem('auth_token'),
          }
        });

        setMatchData(response.data);
        console.log(response.data.data.status);
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    };
    fetchMatchData();

    const intervalId = setInterval(fetchMatchData, 20000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [id]);

  const handlePlayerStats = () => {
    setShowMatchDetails(false);
    setShowPlayerStats(true);
    setShowEnterStatsPopup(false);
  };

  const handleMatchStats = () => {
    setShowMatchDetails(true);
    setShowPlayerStats(false);
    setShowEnterStatsPopup(false);
  };

  const handleEnterStats = () => {
    setShowMatchDetails(false);
    setShowPlayerStats(false);
    setShowEnterStatsPopup(true);
  };

  if (showPlayerStats) {
    return <PlayerStatsPopup id={id} onClose={onClose}  matchStatus={matchData?.data.status} />;
  }

  if (showEnterStatsPopup) {
    return <EnterStatsPopup id={id} onClose={onClose} />;
  }

  if (!matchData) {
    return <div>Loading...</div>;
  }

  const calculateTeamStats = (team) => {
    let yellowCards = 0;
    let redCards = 0;
    console.log(matchData);
    
    if(matchData){
      team.players.forEach(player => {
        console.log(player);
        yellowCards += player.player_stats.broj_zutih_kartona;
        
        redCards += player.player_stats.broj_crvenih_kartona;
      });
    }
   

    return { yellowCards, redCards };
  };

  const homeTeamStats = calculateTeamStats(matchData.data.home_team);
  const awayTeamStats = calculateTeamStats(matchData.data.away_team);

  const getPercentage = (team1Value, team2Value) => {
    const total = team1Value + team2Value;
    return (total === 0 ? 50 : (team1Value / total) * 100);
  };

  const getBarStyles = (team1Value, team2Value) => {
    const percentage = getPercentage(team1Value, team2Value);
    return {
      team1: `${percentage}%`,
      team2: `${100 - percentage}%`
    };
  };

  const shotsStyles = getBarStyles(matchData.data.game_stats.broj_suteva_domacin, matchData.data.game_stats.broj_suteva_gost);
  const shotsOnTargetStyles = getBarStyles(matchData.data.game_stats.sut_u_okvir_domacin, matchData.data.game_stats.sut_u_okvir_gost);
  const shotsOffTargetStyles = getBarStyles(matchData.data.game_stats.sut_van_okvira_domacin, matchData.data.game_stats.sut_van_okvira_gost);
  const possessionStyles = getBarStyles(matchData.data.game_stats.posed_lopte_domacin, matchData.data.game_stats.posed_lopte_gost);
  const yellowCardsStyles = getBarStyles(homeTeamStats.yellowCards, awayTeamStats.yellowCards);
  const redCardsStyles = getBarStyles(homeTeamStats.redCards, awayTeamStats.redCards);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="match-summary">
          <h2 className="match-title">
          {matchData.data.home_team.name} {matchData.data.goals_home} - {matchData.data.goals_away} {matchData.data.away_team.name}
          </h2>
        </div>
        <div className="match-stats">
          {/* Shots */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {matchData.data.game_stats.broj_suteva_domacin}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {matchData.data.game_stats.broj_suteva_gost}
              </div>
            </div>
          </div>

          {/* Shots on Target */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI U OKVIR GOLA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {matchData.data.game_stats.sut_u_okvir_domacin}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsOnTargetStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsOnTargetStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {matchData.data.game_stats.sut_u_okvir_gost}
              </div>
            </div>
          </div>

          {/* Shots off Target */}
          <div className="stats-row">
            <div className="stat-label">ŠUTEVI VAN OKVIRA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {matchData.data.game_stats.sut_van_okvira_domacin}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: shotsOffTargetStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: shotsOffTargetStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {matchData.data.game_stats.sut_van_okvira_gost}
              </div>
            </div>
          </div>

          {/* Possession */}
          <div className="stats-row">
            <div className="stat-label">POSED LOPTE (%)</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {matchData.data.game_stats.posed_lopte_domacin}%
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: possessionStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: possessionStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {matchData.data.game_stats.posed_lopte_gost}%
              </div>
            </div>
          </div>

          {/* Yellow Cards */}
          <div className="stats-row">
            <div className="stat-label">BROJ ŽUTIH KARTONA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {homeTeamStats.yellowCards}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: yellowCardsStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: yellowCardsStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {awayTeamStats.yellowCards}
              </div>
            </div>
          </div>

          {/* Red Cards */}
          <div className="stats-row">
            <div className="stat-label">BROJ CRVENIH KARTONA</div>
            <div className="stat-bar-container">
              <div className="team-stats team1-stats">
              {homeTeamStats.redCards}
              </div>
              <div className="stat-bar">
                <div
                  className="bar-team1"
                  style={{ width: redCardsStyles.team1 }}
                />
                <div
                  className="bar-team2"
                  style={{ width: redCardsStyles.team2 }}
                />
              </div>
              <div className="team-stats team2-stats">
              {awayTeamStats.redCards}
              </div>
            </div>
          </div>
        </div>
        <div className="popup-buttons">
          <button className="stat-btn" onClick={handleMatchStats}>Statistika Meča</button>
          {role!=='guest' && <button className="stat-btn" onClick={handlePlayerStats}>Statistika Igrača</button>}
          {role === 'admin' && matchData.data.status === 'in_progress' && (
            <button className="stat-btn" onClick={handleEnterStats}>Unesi Statistiku</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPopup;
