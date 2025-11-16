import React from 'react'
import PlayerCard from './PlayerCard'
import './PlayerList.css'

const PlayerList = ({ players, currentTurnIndex, onRemovePlayer }) => {
  if (players.length === 0) {
    return (
      <div className="player-list-empty">
        <p>No players yet. Add players to start!</p>
      </div>
    )
  }

  return (
    <div className="player-list">
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentTurn={index === currentTurnIndex}
          onRemove={onRemovePlayer}
        />
      ))}
    </div>
  )
}

export default PlayerList


