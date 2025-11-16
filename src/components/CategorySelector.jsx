import React, { useMemo } from 'react'
import { questionCategories, getAllCategories } from '../data/questions'
import { questionStorage } from '../data/questionStorage'
import './CategorySelector.css'

const CategorySelector = ({ onSelectCategory, onShuffle }) => {
  const allCategories = useMemo(() => {
    const customCategories = questionStorage.getCustomCategories()
    return getAllCategories(customCategories)
  }, [])

  return (
    <div className="category-selector">
      <h2 className="category-title">Choose a Category</h2>
      <div className="categories-grid">
        {Object.keys(allCategories)
          .sort((a, b) => allCategories[a].name.localeCompare(allCategories[b].name))
          .map(categoryKey => {
            const category = allCategories[categoryKey]
            return (
              <button
                key={categoryKey}
                className="category-card"
                onClick={() => onSelectCategory(categoryKey)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                {category.isCustom && <span className="custom-badge">Custom</span>}
              </button>
            )
          })}
      </div>
      <button className="shuffle-btn" onClick={onShuffle}>
        <span className="shuffle-icon">🔀</span>
        Shuffle All Categories
      </button>
    </div>
  )
}

export default CategorySelector


