import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useGame } from '../context/GameContext'
import { questionCategories, getAllCategories } from '../data/questions'
import { questionStorage } from '../data/questionStorage'
import QuestionCard from '../components/QuestionCard'
import PlayerList from '../components/PlayerList'
import ResetConfirmationModal from '../components/ResetConfirmationModal'
import './GameScreen.css'

const GameScreen = ({ onBack, onStats, onCustomQuestions, onReset }) => {
  const { 
    currentQuestion, 
    selectedCategory, 
    shuffleMode,
    players,
    currentTurnIndex,
    getCurrentPlayer,
    handleIHave,
    handleIHavent,
    changeCategory,
    resetGame,
    getWinner
  } = useGame()
  
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const categoryMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false)
      }
    }

    if (showCategoryMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCategoryMenu])

  const currentPlayer = getCurrentPlayer()
  const categoryName = shuffleMode 
    ? 'Shuffle Mode' 
    : (currentQuestion?.categoryName || 'General')

  const handleCategoryChange = (categoryKey) => {
    if (categoryKey === 'shuffle') {
      changeCategory(null, true)
    } else {
      changeCategory(categoryKey, false)
    }
    setShowCategoryMenu(false)
  }

  const allCategories = useMemo(() => {
    const customCategories = questionStorage.getCustomCategories()
    return getAllCategories(customCategories)
  }, [])

  const currentCategoryDisplay = shuffleMode 
    ? '🔀 Shuffle' 
    : (selectedCategory ? `${allCategories[selectedCategory]?.icon || '📝'} ${allCategories[selectedCategory]?.name || selectedCategory}` : 'Select Category')

  const handleResetClick = () => {
    setShowResetModal(true)
  }

  const handleResetConfirm = () => {
    resetGame()
    setShowResetModal(false)
    // Navigate back to home screen after reset
    if (onReset) {
      onReset()
    } else {
      // Fallback: go back to category screen
      onBack()
    }
  }

  const handleResetCancel = () => {
    setShowResetModal(false)
  }

  const winners = getWinner()

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-actions">
          <div className="category-selector-wrapper" ref={categoryMenuRef}>
            <button 
              className="category-change-btn" 
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            >
              {currentCategoryDisplay} ▼
            </button>
            {showCategoryMenu && (
              <div className="category-dropdown">
                <button 
                  className="category-dropdown-item"
                  onClick={() => handleCategoryChange('shuffle')}
                >
                  <span>🔀</span> Shuffle All Categories
                </button>
                {Object.keys(allCategories)
                  .sort((a, b) => allCategories[a].name.localeCompare(allCategories[b].name))
                  .map(categoryKey => {
                    const category = allCategories[categoryKey]
                    return (
                      <button
                        key={categoryKey}
                        className="category-dropdown-item"
                        onClick={() => handleCategoryChange(categoryKey)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{category.icon}</span> {category.name}
                        </span>
                        {category.isCustom && <span className="custom-badge-small">Custom</span>}
                      </button>
                    )
                  })}
              </div>
            )}
          </div>
          <button className="header-btn" onClick={onStats}>Stats</button>
          <button className="header-btn" onClick={onCustomQuestions}>Custom</button>
          <button className="header-btn" onClick={handleResetClick}>Reset</button>
        </div>
      </div>

      <ResetConfirmationModal
        isOpen={showResetModal}
        winners={winners}
        onConfirm={handleResetConfirm}
        onCancel={handleResetCancel}
      />

      <div className="game-content">
        <div className="question-section">
          <QuestionCard
            question={currentQuestion}
            categoryName={categoryName}
            onIHave={handleIHave}
            onIHavent={handleIHavent}
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="players-section">
          <h3 className="players-title">Players</h3>
          <PlayerList 
            players={players}
            currentTurnIndex={currentTurnIndex}
          />
        </div>
      </div>
    </div>
  )
}

export default GameScreen


