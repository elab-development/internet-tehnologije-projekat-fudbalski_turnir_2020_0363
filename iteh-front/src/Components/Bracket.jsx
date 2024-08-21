import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Bracket.css';
import NavigationMenu from './NavigationMenu';
import { toPng } from 'html-to-image';

const Bracket = () => {
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role } = state || {};
  const [stagesToShow, setStagesToShow] = useState({});

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:8000/api/tournaments',
          headers: { 
            'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
          },
        };
        const response = await axios.request(config);
        setTournaments(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the tournaments!", error);
      }
    };

    fetchTournaments();
  }, []);

  const fetchTournament = useCallback(async () => {
    
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/tournaments/${id}`,
        headers: { 
          'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
        },
      };
      const response = await axios.request(config);
      setTournament(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the tournament!", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTournament(); 
    const intervalId = setInterval(fetchTournament, 10000);

    return () => clearInterval(intervalId);
  }, [fetchTournament]);

  useEffect(() => {
    if (tournament) {
      setMatches(tournament.games);
    }
  }, [tournament]);

  const [matches, setMatches] = useState([]);
  useEffect(() => {
    const stages = generateStages(matches);
    updateStagesWithWinners(stages);
    setStagesToShow(stages);
  }, [matches]);

  const generateStages = (matches) => {
    const stages = {
      "Osmina-finala": [],
      "Cetvrtfinale": [],
      "Polufinale": [],
      "Finale": []
    };

    const maxNumGame = Math.max(...matches.map(match => match.num_game));
    
    for(let i = maxNumGame; i >= 1; i--){
      let currentStage;

      if (i <= 15 && i > 7) {
        currentStage = "Osmina-finala";
      } else if (i <= 7 && i > 3) {
        currentStage = "Cetvrtfinale";
      } else if (i <= 3 && i > 1) {
        currentStage = "Polufinale";
      } else if (i === 1) {
        currentStage = "Finale";
      }

      const matchesInStage = matches.filter(match => match.num_game === i);
      stages[currentStage].push(...matchesInStage);
    }
    return stages;
  };

  const updateStagesWithWinners = (stages) => {
    const updateMatch = (stageName, currentMatches) => {
      const nextStageMatches = stages[stageName];
      currentMatches.forEach(match => {
        const winner = match.status === 'completed' ? match.winner : null;
        if (winner) {
          const nextMatch = nextStageMatches.find(m => m.num_game === Math.floor(match.num_game / 2));
          if (nextMatch) {
            if (!nextMatch.home_team || nextMatch.home_team.name.includes('Nepoznat tim')) {
              nextMatch.home_team = winner;
            } else if (!nextMatch.away_team || nextMatch.away_team.name.includes('Nepoznat tim')) {
              nextMatch.away_team = winner;
            }
          }
        }
      });
    };

    updateMatch("Cetvrtfinale", stages["Osmina-finala"]);
    updateMatch("Polufinale", stages["Cetvrtfinale"]);
    updateMatch("Finale", stages["Polufinale"]);
  };

  const handleMatchesNavigation = () => {
    navigate(`/matches/${id}`, { state: {  role } });
  };

  const handleRefresh = () => {
    navigate(`/bracket/${id}`, { state: {  role } });
  };

  const handleTournamentClick = (tournament) => {
    navigate(`/bracket/${tournament.id}`, { state: { role } });
  };

  const tournamentName = tournament?.name || "";

  const handleExportClick = () => {
    const bracketElement = document.querySelector('.bracket-match');
    if (bracketElement) {
      toPng(bracketElement)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${tournamentName}_bracket.png`;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to generate image:', err);
        });
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bracket-container">
      <div className="sidebar">
        <NavigationMenu role={role} />
        <h3>Svi Turniri</h3>
        <div className="tournaments-list">
          {tournaments && tournaments.map(tournament => (
            <div
              key={tournament.id}
              className="tournament-item"
              onClick={() => handleTournamentClick(tournament)}
            >
              <p>{tournament.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bracket-content">
        <h2 className="tournament-title">{tournamentName}</h2>
        <div className="action-buttons">
          <button onClick={handleMatchesNavigation} className="action-btn">Mečevi</button>
          <button onClick={handleRefresh} className="action-btn">Žreb</button>
          <button onClick={handleExportClick} className="action-btn">Sačuvaj kao sliku</button>
        </div>
        <div className="bracket-match">
          {Object.entries(stagesToShow).map(([stage, stageMatches]) => (
            stageMatches.length > 0 && (
              <div key={stage} className={`bracket-column ${stage.toLowerCase().replace(/\s/g, '-')}`}>
                <h2 className="phase-title">{stage}</h2>
                {stageMatches.map(match => (
                  <div key={match.id} className="bracket-card">
                    {match.home_team?.name || 'Nepoznat tim'} {(match.goals_home === 0 && match.goals_away === 0) ? ' : ' : `${match.goals_home !== null ? match.goals_home : ''} : ${match.goals_away !== null ? match.goals_away : ''}`} {match.away_team?.name || 'Nepoznat tim'}
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bracket;
