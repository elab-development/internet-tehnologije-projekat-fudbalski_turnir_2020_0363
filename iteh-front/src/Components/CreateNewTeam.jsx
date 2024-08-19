import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreateNewTeam.css';
import PlayerModal from './PlayerModal';
import NavigationMenu from './NavigationMenu';

const CreateNewTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(Array(5).fill({ id: null, name: '', number: '' }));
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [editMode, setEditMode] = useState(Array(5).fill(false));

  const handlePlayerChange = (index, event) => {
    const { name, value } = event.target;
    setPlayers(prevPlayers =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, [name]: value } : player
      )
    );
  };

  const handleAddTeam = () => {
    if (!teamName) {
      alert('Ime tima je obavezno');
      return;
    }

    const numbers = players.map(player => player.number);
    
    const hasInvalidNumber = numbers.some(number => !number || number < 16 || number > 40);

    const playerIdentifiers = players.map(player => `${player.name}-${player.number}`);


    if (hasInvalidNumber) {
      alert('Broj godina igraca mora biti izmedju 16 i 40 godina');
      return;
    }



    if (players.every(player => player.name && player.number)) {
      navigate('/add-teams', {
        state: {
          newTeam: {
            id: null,
            name: teamName,
            players: players
          },
          rowIndex: location.state.rowIndex,
          name: location.state.name,
          place: location.state.place,
          existingTeams: location.state.existingTeams,
          logo: location.state.logo
        }
      });
    } else {
      alert('Svaki tim mora imati 5 igrača');
    }
  };

  const handleBackClick = () => {
    navigate('/add-teams', {
      state: {
        name: location.state.name,
        place: location.state.place,
        existingTeams: location.state.existingTeams,
        logo: location.state.logo
      }
    });
  };

  const handleNewPlayerClick = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = true;

    const updatePlayers = [...players];
    updatePlayers[index] = { id: null, name: '', number: '' };

    setEditMode(updatedEditMode);
    setPlayers(updatePlayers);
  };

  const handleChoosePlayer = (index) => {
    setSelectedPlayerIndex(index);
    setIsPlayerModalOpen(true);
  };

  const handleExistingPlayerClick = (index) => {
    const updatedEditMode = [...editMode];
    updatedEditMode[index] = false;
    setEditMode(updatedEditMode);
    handleChoosePlayer(index);
  };

  const handleSelectPlayer = (player) => {
    const updatedPlayers = [...players];
    updatedPlayers[selectedPlayerIndex] = player;
    setPlayers(updatedPlayers);

    const updatedEditMode = [...editMode];
    updatedEditMode[selectedPlayerIndex] = false;
    setEditMode(updatedEditMode);

    setIsPlayerModalOpen(false);
  };

  return (
    <div className="create-new-team-container">
      <NavigationMenu role={role} />
      <h2>Napravi Novi Tim</h2>
      <form>
        <div className="input-container">
          <label>Ime Tima:</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Unesi Ime Tima"
            required
          />
        </div>
        {players.map((player, index) => (
          <div key={index} className="player-row">
            <input
              type="text"
              name="name"
              value={player.name}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder="Ime i Prezime Igrača"
              required
              className="player-input"
              disabled={!editMode[index]}
            />
            <input
              type="number"
              name="number"
              value={player.number}
              onChange={(e) => handlePlayerChange(index, e)}
              placeholder="Broj godina igraca"
              required
              min="16"
              max="40"
              className="player-input"
              
            />
            <button
              type="button"
              className="choose-player-btn"
              onClick={() => handleExistingPlayerClick(index)}
            >
              Izaberi Postojećeg Igrača
            </button>
            <button
              type="button"
              className="new-player-btn"
              onClick={() => handleNewPlayerClick(index)}
            >
              Nov Igrač
            </button>
          </div>
        ))}
        <div className="button-container">
          <button type="button" onClick={handleBackClick} className="action-btn create-back-btn">
            Nazad
          </button>
          <button
            type="button"
            onClick={handleAddTeam}
            className="action-btn add-team-btn"
          >
            Dodaj Tim
          </button>
        </div>
      </form>
      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        onSelectPlayer={handleSelectPlayer}
      />
    </div>
  );
};

export default CreateNewTeam;
