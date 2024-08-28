import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Matches.css';
import axios from 'axios';
import NavigationMenu from './NavigationMenu';
import MatchDetailsPopup from './MatchDetailsPopup';
import Pusher from 'pusher-js';
const Matches = () => {
  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { role } = state || {};
  const [stagesToShow, setStagesToShow] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  
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
    } finally {
      
    }
  }, [id]);

 
  useEffect(() => {
    fetchTournament(); 
   
    const pusher = new Pusher('1ef4a6a15882c25d1174', {
      cluster: 'eu',
      encrypted: true
    });

    const channel = pusher.subscribe('tournament.' + id);
    channel.bind('tournament-stats-updated', function(data) {
      fetchTournament();
    });

    return () => {
      pusher.unsubscribe('tournament.' + id);
     
    };

  }, [id]);

  useEffect(() => {
  
    if (tournament) {
      setMatches(tournament.games);
    }
  }, [tournament]);

  const [matches, setMatches] = useState([]);
  useEffect(() => {

    const stages = generateStages(matches);
    console.log('Matches updated:', matches);
    updateStagesWithWinners(stages);
    setStagesToShow(stages);
  }, [matches]);
  const handleRefresh = () => {
    navigate(`/matches/${id}`, { state: { role } });
  };

  const handleBracketNavigation = () => {
    navigate(`/bracket/${id}`, { state: { role } });
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match.id);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedMatch(null);
    setShowPopup(false);
  };



  const updateMatchStatus = async (id, status) => {
    try {
      const config = {
        method: 'put',
        url: `http://localhost:8000/api/games/status/${id}`,
        headers: { 
          'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
        },
        data: { status },
      };
      await axios.request(config);
  
     fetchTournament();
      
      console.log(matches);
    } catch (error) {
      console.error(`There was an error updating the status of match ${id}!`, error);
    }
  };



  const updateWinner = async (id,status) => {
    try {
      const config = {
        method: 'put',
        url: `http://localhost:8000/api/games/finish/${id}`,
        headers: { 
          'Authorization': "Bearer " + window.sessionStorage.getItem('auth_token')
        },
        
      };
      const response= await axios.request(config);
      const updatedMatches = matches.map(match => {
        if (match.id === id) {
          return { ...match, status };
        }
        return match;
      });
      if(response.data.stat===false){
        alert(response.data.message);
      }
      else{
        console.log("Uspesno zavrsena utakmica");
        // setMatches(updatedMatches);
        fetchTournament();
      }
    
    } catch (error) {
      console.error(`There was an error updating the status of match ${id}!`, error);
    }
  };


  const handleStartMatch = (id) => {
    updateMatchStatus(id, 'in_progress');
  };

  const handleEndMatch = (id) => {

    updateWinner(id, 'completed');
  };

  

const generateStages = (matches) => {
  const stages = {
      "Osmina finala": [],
      "Četvrtfinale": [],
      "Polufinale": [],
      "Finale": []
  };

  // Pronađi maksimalni num_game
  const maxNumGame = Math.max(...matches.map(match => match.num_game));
  
  // Postavi faze na osnovu maksimalnog num_game
  let currentStage;
  let numGame = maxNumGame;
  
  for(let i=numGame;i>=1;i--){
  
    
    console.log(i);
 
      if (i <= 15 && i>7) {
          currentStage = "Osmina finala";
      } else if (i <= 7 && i>3) {
          currentStage = "Četvrtfinale";
      } else if (i <= 3 && i>1) {
          currentStage = "Polufinale";
      } else if (i === 1) {
          currentStage = "Finale";
      }

      const matchesInStage = matches.filter(match => match.num_game === i);
      stages[currentStage].push(...matchesInStage);
      
    
    }
  
  console.log(stages);
  return stages;
};

  
const updateStagesWithWinners = (stages) => {
  const getNextMatch = (numGame) => {
      return matches.find(match => match.num_game === numGame);
  };

  const updateMatch = (stageName, currentMatches) => {
    const nextStageMatches = stages[stageName];

    currentMatches.forEach(match => {
        const numGame = match.num_game;
        const winner = match.status === 'completed' ? match.winner : null;

        if (winner) {
            const nextMatch = nextStageMatches.find(m => m.num_game === Math.floor(numGame / 2));
            if (nextMatch) {
                if (nextMatch.home_team && !nextMatch.home_team.name.includes('Unknown Team') && numGame % 2 !== 0) {
                    nextMatch.home_team = winner;
                } else if (nextMatch.away_team && !nextMatch.away_team.name.includes('Unknown Team')) {
                    nextMatch.away_team = winner;
                }
            }
        } else {
           
            
        }
    });
};

// Ažuriraj mečeve za sve faze
updateMatch("Četvrtfinale", stages["Osmina finala"]);
updateMatch("Polufinale", stages["Četvrtfinale"]);
updateMatch("Finale", stages["Polufinale"]);

};


  const tournamentName = tournament?.name || "";

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }


  return (
    <div className="page-container">
      <div className="sidebar">
        <NavigationMenu role={role} />
        <h3>Svi Turniri</h3>
        <div className="tournaments-list">
          {tournaments && tournaments.map(tournament => (
            <div
              key={tournament.id}
              className="tournament-item"
              onClick={() => navigate(`/matches/${tournament.id}`, { state: { role } })}
            >
              <p>{tournament?.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="matches-container">
        <h2 className="tournament-title">{tournamentName}</h2>
        <div className="action-buttons">
          <button onClick={handleRefresh} className="action-btn">Mečevi</button>
          <button onClick={handleBracketNavigation} className="action-btn">Žreb</button>
        </div>
        {Object.entries(stagesToShow).map(([stage, stageMatches]) => (
          stageMatches.length > 0 && (
            <div key={stage} className="stage-container">
              <h3 className="stage-title">{stage}</h3>
              <div className="matches-list">
                {stageMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className={`match-card ${index % 2 === 1 ? 'right' : 'left'}`}
                  >
                    <div className="match-info">
                      {match.home_team && match.away_team ? (
                        <>
                          {match.home_team.name}  -  {match.away_team.name}
                        </>
                      ) : (
                        <span>Trenutno nisu dostupne informacije o utakmici</span>
                      )}
                    </div>
                    <div className={`match-status ${match.status}`}>
                      {match.status === 'in_progress' ? 'U Toku' : match.status === 'completed' ? 'Završena' : match.status === 'not_started' ? 'Nije Počela' : ''}
                    </div>
                    {match.home_team && match.away_team && (
                          <>
                            {role === 'admin' && match.status === 'not_started' && (
                              <button className='start-btn' onClick={() => handleStartMatch(match.id)}>Zapocni mec</button>
                            )}
                            {role === 'admin' && match.status === 'in_progress' && (
                              <button className='end-btn' onClick={() => handleEndMatch(match.id)}>Zavrsi mec</button>
                            )}
                            {(match.status === 'in_progress' || match.status === 'completed') && (
                              <button className='stats-btn' onClick={() => handleMatchClick(match)}>Statistika</button>
                            )}
                          </>
                        )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <MatchDetailsPopup id={selectedMatch} onClose={handleClosePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
