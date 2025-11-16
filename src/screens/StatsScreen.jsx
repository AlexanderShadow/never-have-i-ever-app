import React from 'react'
import StatsDisplay from '../components/StatsDisplay'
import { useGame } from '../context/GameContext'
import './StatsScreen.css'

const StatsScreen = ({ onBack }) => {
  const { players } = useGame()

  return (
    <div className="stats-screen">
      <div className="stats-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="stats-header-title">Statistics</h2>
        <div></div>
      </div>
      <div className="stats-content">
        <StatsDisplay players={players} />
      </div>
    </div>
  )
}

export default StatsScreen


