import React from 'react'
import './QuestionCard.css'

const QuestionCard = ({ question, categoryName, onIHave, onIHavent, currentPlayer }) => {
  if (!question) {
    return (
      <div className="question-card">
        <p>No more questions available. Reset the game to continue!</p>
      </div>
    )
  }

  return (
    <div className="question-card">
      <div className="question-category-badge">
        {categoryName}
      </div>
      <h2 className="question-text">{question.text}</h2>
      {currentPlayer && (
        <div className="current-player-indicator">
          <span>{currentPlayer.name}'s turn</span>
        </div>
      )}
      <div className="question-actions">
        <button className="btn-i-have" onClick={onIHave}>
          I Have! ✓
        </button>
        <button className="btn-i-havent" onClick={onIHavent}>
          I Haven't ✋
        </button>
      </div>
    </div>
  )
}

export default QuestionCard


