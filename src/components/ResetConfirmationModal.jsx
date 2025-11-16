import React from 'react'
import './ResetConfirmationModal.css'

const ResetConfirmationModal = ({ isOpen, winners, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="reset-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reset-modal-header">
          <h2>Reset Game?</h2>
        </div>
        
        <div className="reset-modal-content">
          {winners && winners.length > 0 ? (
            <div className="winner-section">
              <div className="winner-label">🏆 Winner{winners.length > 1 ? 's' : ''} 🏆</div>
              <div className="winners-list">
                {winners.map((winner, index) => (
                  <div key={winner.id} className="winner-item">
                    <span className="winner-name">{winner.name}</span>
                    <span className="winner-points">{winner.points} point{winner.points !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-winner-message">No points scored yet.</p>
          )}
          
          <p className="reset-warning">
            This will completely reset the game and remove all players. 
            You'll need to start from scratch.
          </p>
        </div>

        <div className="reset-modal-actions">
          <button className="reset-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="reset-confirm-btn" onClick={onConfirm}>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetConfirmationModal

