import React, { useState } from 'react'
import './CustomQuestionModal.css'

const CustomQuestionModal = ({ isOpen, onClose, onSave, category, question = null, categoryName }) => {
  const [questionText, setQuestionText] = useState(question?.text || '')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (questionText.trim()) {
      onSave(questionText.trim())
      setQuestionText('')
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{question ? 'Edit Question' : 'Add Custom Question'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Category: {categoryName}</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your custom question..."
              rows={4}
              required
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {question ? 'Update' : 'Add'} Question
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomQuestionModal


