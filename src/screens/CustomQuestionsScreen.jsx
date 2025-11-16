import React, { useState, useEffect } from 'react'
import { questionCategories, getAllCategories } from '../data/questions'
import { questionStorage } from '../data/questionStorage'
import CustomQuestionModal from '../components/CustomQuestionModal'
import './CustomQuestionsScreen.css'

const CustomQuestionsScreen = ({ onBack }) => {
  const [customQuestions, setCustomQuestions] = useState({})
  const [customCategories, setCustomCategories] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('📝')

  useEffect(() => {
    loadCustomQuestions()
    loadCustomCategories()
  }, [])

  const loadCustomQuestions = () => {
    const questions = questionStorage.getCustomQuestions()
    setCustomQuestions(questions)
  }

  const loadCustomCategories = () => {
    const categories = questionStorage.getCustomCategories()
    setCustomCategories(categories)
  }

  const allCategories = getAllCategories(customCategories)

  const handleAddQuestion = (category) => {
    setSelectedCategory(category)
    setEditingQuestion(null)
    setIsModalOpen(true)
  }

  const handleEditQuestion = (category, question) => {
    setSelectedCategory(category)
    setEditingQuestion(question)
    setIsModalOpen(true)
  }

  const handleSaveQuestion = (questionText) => {
    if (editingQuestion) {
      questionStorage.updateCustomQuestion(selectedCategory, editingQuestion.id, questionText)
    } else {
      questionStorage.addCustomQuestion(selectedCategory, questionText)
    }
    loadCustomQuestions()
  }

  const handleDeleteQuestion = (category, questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      questionStorage.deleteCustomQuestion(category, questionId)
      loadCustomQuestions()
      loadCustomCategories() // Reload in case category was deleted
    }
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const categoryKey = `custom_${Date.now()}`
      questionStorage.createCustomCategory(categoryKey, newCategoryName.trim(), newCategoryIcon)
      loadCustomCategories()
      setNewCategoryName('')
      setNewCategoryIcon('📝')
      setIsCreateCategoryModalOpen(false)
      // Automatically open add question modal for the new category
      setSelectedCategory(categoryKey)
      setEditingQuestion(null)
      setIsModalOpen(true)
    }
  }

  const handleDeleteCategory = (categoryKey) => {
    if (window.confirm('Are you sure you want to delete this custom category? All questions in it will be deleted.')) {
      // Delete all questions in the category
      const questions = customQuestions[categoryKey] || []
      questions.forEach(q => {
        questionStorage.deleteCustomQuestion(categoryKey, q.id)
      })
      // Delete the category
      questionStorage.deleteCustomCategory(categoryKey)
      loadCustomQuestions()
      loadCustomCategories()
    }
  }

  const categoryName = selectedCategory 
    ? (allCategories[selectedCategory]?.name || selectedCategory)
    : ''

  return (
    <div className="custom-questions-screen">
      <div className="custom-questions-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="custom-questions-title">Custom Questions</h2>
        <div></div>
      </div>

      <div className="custom-questions-content">
        <div className="create-category-section">
          <button 
            className="create-category-btn"
            onClick={() => setIsCreateCategoryModalOpen(true)}
          >
            + Create New Category
          </button>
        </div>

        {Object.keys(allCategories).map(categoryKey => {
          const category = allCategories[categoryKey]
          const categoryCustomQuestions = customQuestions[categoryKey] || []
          
          return (
            <div key={categoryKey} className="category-section">
              <div className="category-section-header">
                <h3 className="category-section-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                  {category.isCustom && <span className="custom-badge">Custom</span>}
                </h3>
                <div className="category-actions">
                  <button 
                    className="add-question-btn"
                    onClick={() => handleAddQuestion(categoryKey)}
                  >
                    + Add Question
                  </button>
                  {category.isCustom && (
                    <button 
                      className="delete-category-btn"
                      onClick={() => handleDeleteCategory(categoryKey)}
                    >
                      Delete Category
                    </button>
                  )}
                </div>
              </div>
              
              {categoryCustomQuestions.length === 0 ? (
                <p className="no-questions">No custom questions yet</p>
              ) : (
                <div className="questions-list">
                  {categoryCustomQuestions.map(question => (
                    <div key={question.id} className="custom-question-item">
                      <p className="question-text">{question.text}</p>
                      <div className="question-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditQuestion(categoryKey, question)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteQuestion(categoryKey, question.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <CustomQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        category={selectedCategory}
        question={editingQuestion}
        categoryName={categoryName}
      />

      {isCreateCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateCategoryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Category</h3>
              <button className="modal-close" onClick={() => setIsCreateCategoryModalOpen(false)}>×</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }} className="modal-form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Icon (emoji)</label>
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="📝 or use Win+. to insert emoji"
                  maxLength="10"
                />
                <small className="emoji-hint">
                  Tip: Press Win+. (Windows) or Cmd+Ctrl+Space (Mac) to insert emoji from keyboard
                </small>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsCreateCategoryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomQuestionsScreen


