import React from 'react'
import './StatsDisplay.css'

const StatsDisplay = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    return b.points - a.points
  })

  return (
    <div className="stats-display">
      <h2 className="stats-title">Game Statistics</h2>
      <div className="stats-list">
        {sortedPlayers.map((player, index) => (
          <div key={player.id} className="stat-item">
            <div className="stat-rank">#{index + 1}</div>
            <div className="stat-player-info">
              <div className="stat-player-name">{player.name}</div>
              <div className="stat-player-details">
                <span className="stat-detail">
                  <span className="stat-detail-label">Points:</span>
                  <span className="stat-detail-value points">{player.points}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsDisplay


