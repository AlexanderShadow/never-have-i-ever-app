import React from 'react'
import './HomeScreen.css'

const HomeScreen = ({ onStart }) => {
  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="home-title">Never Have I Ever</h1>
        <p className="home-subtitle">The Ultimate Drinking Game</p>
        <div className="home-description">
          <p>Add up to 15 players, choose a category, and let the fun begin!</p>
          <p>Answer honestly or take a drink 🍺</p>
        </div>
        <button className="start-btn" onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  )
}

export default HomeScreen


