import React from 'react'
import './PlayerCard.css'

const PlayerCard = ({ player, isCurrentTurn, onRemove }) => {
  return (
    <div className={`player-card ${isCurrentTurn ? 'current-turn' : ''}`}>
      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>
        {isCurrentTurn && <span className="turn-badge">Your Turn</span>}
      </div>
      <div className="player-stats">
        <div className="stat">
          <span className="stat-label">Points</span>
          <span className="stat-value points">{player.points}</span>
        </div>
      </div>
      {onRemove && (
        <button className="remove-player-btn" onClick={() => onRemove(player.id)}>
          ×
        </button>
      )}
    </div>
  )
}

export default PlayerCard


