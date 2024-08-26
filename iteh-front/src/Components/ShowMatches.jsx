import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import './ShowMatches.css';
import NavigationButtons from './NavigationButtons';
import NavigationMenu from './NavigationMenu';

const ShowMatches = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 38;

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await axios.get(
        `/v4/competitions/PL/matches?matchday=${currentPage}`,
        {
          headers: { 'X-Auth-Token': '3f67e6c5848344f99e46142768ce07fa' },
        }
      );
      setMatches(response.data.matches);
    };

    fetchMatches();
  }, [currentPage]);

  return (
    <div className="show_matches">
      <NavigationMenu role={window.sessionStorage.getItem("role")} />
      <h1>Premier League Matches</h1>
      <NavigationButtons />
      <div className="games-container">
        {matches.map(match => (
          <div key={match.id} className="game-card">
            <img src={`https://crests.football-data.org/${match.homeTeam.id}.svg`} alt={match.homeTeam.name} />
            <div className="team-names">
              <span style={{ fontWeight: match.score.winner === 'HOME_TEAM' ? 'bold' : 'normal' }}>
                {match.homeTeam.name}
              </span>
              <span style={{ fontWeight: match.score.winner === 'HOME_TEAM' ? 'bold' : 'normal' }}>
                {match.score.fullTime.home !== null && match.score.fullTime.home}
              </span>
              <span>vs</span>
              <span style={{ fontWeight: match.score.winner === 'AWAY_TEAM' ? 'bold' : 'normal' }}>
                {match.score.fullTime.away !== null && match.score.fullTime.away}
              </span>
              <span style={{ fontWeight: match.score.winner === 'AWAY_TEAM' ? 'bold' : 'normal' }}>
                {match.awayTeam.name}
              </span>

            </div>
            <img src={`https://crests.football-data.org/${match.awayTeam.id}.svg`} alt={match.awayTeam.name} />
            <div>{new Date(match.utcDate).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ShowMatches;
