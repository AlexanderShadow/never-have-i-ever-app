import React from 'react'
import CategorySelector from '../components/CategorySelector'
import { useGame } from '../context/GameContext'
import './CategoryScreen.css'

const CategoryScreen = ({ onStartGame }) => {
  const { startGame } = useGame()

  const handleCategorySelect = (category) => {
    startGame(category, false)
    onStartGame()
  }

  const handleShuffle = () => {
    startGame(null, true)
    onStartGame()
  }

  return (
    <div className="category-screen">
      <CategorySelector 
        onSelectCategory={handleCategorySelect}
        onShuffle={handleShuffle}
      />
    </div>
  )
}

export default CategoryScreen


