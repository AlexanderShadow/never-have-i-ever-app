import React, { useState } from 'react'
import { GameProvider } from './context/GameContext'
import HomeScreen from './screens/HomeScreen'
import PlayerSetupScreen from './screens/PlayerSetupScreen'
import CategoryScreen from './screens/CategoryScreen'
import GameScreen from './screens/GameScreen'
import StatsScreen from './screens/StatsScreen'
import CustomQuestionsScreen from './screens/CustomQuestionsScreen'
import './styles/App.css'

const SCREENS = {
  HOME: 'home',
  PLAYER_SETUP: 'player_setup',
  CATEGORY: 'category',
  GAME: 'game',
  STATS: 'stats',
  CUSTOM_QUESTIONS: 'custom_questions'
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME)

  const handleStart = () => {
    setCurrentScreen(SCREENS.PLAYER_SETUP)
  }

  const handlePlayerSetupNext = () => {
    setCurrentScreen(SCREENS.CATEGORY)
  }

  const handleCategoryNext = () => {
    setCurrentScreen(SCREENS.GAME)
  }

  const handleBackToCategory = () => {
    setCurrentScreen(SCREENS.CATEGORY)
  }

  const handleShowStats = () => {
    setCurrentScreen(SCREENS.STATS)
  }

  const handleShowCustomQuestions = () => {
    setCurrentScreen(SCREENS.CUSTOM_QUESTIONS)
  }

  const handleBackToGame = () => {
    setCurrentScreen(SCREENS.GAME)
  }

  const handleBackToHome = () => {
    setCurrentScreen(SCREENS.HOME)
  }

  return (
    <GameProvider>
      <div className="app">
        {currentScreen === SCREENS.HOME && (
          <HomeScreen onStart={handleStart} />
        )}
        
        {currentScreen === SCREENS.PLAYER_SETUP && (
          <PlayerSetupScreen onNext={handlePlayerSetupNext} />
        )}
        
        {currentScreen === SCREENS.CATEGORY && (
          <CategoryScreen onStartGame={handleCategoryNext} />
        )}
        
        {currentScreen === SCREENS.GAME && (
          <GameScreen 
            onBack={handleBackToCategory}
            onStats={handleShowStats}
            onCustomQuestions={handleShowCustomQuestions}
            onReset={handleBackToHome}
          />
        )}
        
        {currentScreen === SCREENS.STATS && (
          <StatsScreen onBack={handleBackToGame} />
        )}
        
        {currentScreen === SCREENS.CUSTOM_QUESTIONS && (
          <CustomQuestionsScreen onBack={handleBackToGame} />
        )}
      </div>
    </GameProvider>
  )
}

export default App


