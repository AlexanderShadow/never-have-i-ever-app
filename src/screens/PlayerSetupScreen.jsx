import React, { useState } from 'react'
import { useGame } from '../context/GameContext'
import PlayerList from '../components/PlayerList'
import './PlayerSetupScreen.css'

const PlayerSetupScreen = ({ onNext }) => {
  const { players, addPlayer, removePlayer } = useGame()
  const [playerName, setPlayerName] = useState('')

  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (playerName.trim() && players.length < 15) {
      if (addPlayer(playerName)) {
        setPlayerName('')
      }
    }
  }

  const handleNext = () => {
    if (players.length > 0) {
      onNext()
    }
  }

  return (
    <div className="player-setup-screen">
      <div className="setup-content">
        <h2 className="setup-title">Add Players</h2>
        <p className="setup-subtitle">Add up to 15 players</p>
        
        <form onSubmit={handleAddPlayer} className="add-player-form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name..."
            className="player-input"
            maxLength={30}
            disabled={players.length >= 15}
          />
          <button 
            type="submit" 
            className="add-player-btn"
            disabled={!playerName.trim() || players.length >= 15}
          >
            Add Player
          </button>
        </form>

        {players.length >= 15 && (
          <p className="max-players-message">Maximum 15 players reached!</p>
        )}

        <div className="players-section">
          <PlayerList 
            players={players} 
            currentTurnIndex={-1}
            onRemovePlayer={removePlayer}
          />
        </div>

        <button 
          className="next-btn" 
          onClick={handleNext}
          disabled={players.length === 0}
        >
          Continue ({players.length} {players.length === 1 ? 'player' : 'players'})
        </button>
      </div>
    </div>
  )
}

export default PlayerSetupScreen


