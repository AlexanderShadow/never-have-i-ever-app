import React, { createContext, useContext, useState, useEffect } from 'react'
import { questionCategories, getAllQuestions } from '../data/questions'
import { questionStorage } from '../data/questionStorage'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [shuffleMode, setShuffleMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [usedQuestions, setUsedQuestions] = useState(new Set())

  // Initialize players from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('never-have-i-ever-players')
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers)
        // Remove drinks property from existing players (migration)
        const cleanedPlayers = parsedPlayers.map(p => {
          const { drinks, ...playerWithoutDrinks } = p
          return playerWithoutDrinks
        })
        setPlayers(cleanedPlayers)
      } catch (error) {
        console.error('Error loading players:', error)
      }
    }
  }, [])

  // Save players to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('never-have-i-ever-players', JSON.stringify(players))
    }
  }, [players])

  // Add a player
  const addPlayer = (name) => {
    if (players.length >= 15) {
      return false
    }
    const newPlayer = {
      id: Date.now().toString(),
      name: name.trim(),
      points: 0
    }
    setPlayers([...players, newPlayer])
    return true
  }

  // Remove a player
  const removePlayer = (playerId) => {
    setPlayers(players.filter(p => p.id !== playerId))
    if (currentTurnIndex >= players.length - 1) {
      setCurrentTurnIndex(0)
    }
  }

  // Get current player
  const getCurrentPlayer = () => {
    if (players.length === 0) return null
    return players[currentTurnIndex]
  }

  // Advance to next turn
  const nextTurn = () => {
    if (players.length === 0) return
    setCurrentTurnIndex((prev) => (prev + 1) % players.length)
  }

  // Handle "I Have" response
  const handleIHave = () => {
    const currentPlayer = getCurrentPlayer()
    if (currentPlayer) {
      setPlayers(players.map(p => 
        p.id === currentPlayer.id 
          ? { ...p, points: p.points + 1 }
          : p
      ))
    }
    nextTurn()
    getNextQuestion()
  }

  // Handle "I Haven't" response
  const handleIHavent = () => {
    nextTurn()
    getNextQuestion()
  }

  // Get questions for selected category or all questions in shuffle mode
  const getAvailableQuestions = (category = undefined, shuffle = undefined) => {
    const customQuestions = questionStorage.getCustomQuestions()
    let questions = []
    
    // Use provided parameters or fall back to state
    const activeCategory = category !== undefined ? category : selectedCategory
    const activeShuffle = shuffle !== undefined ? shuffle : shuffleMode

    if (activeShuffle) {
      // Get all questions from all categories
      questions = getAllQuestions()
      // Add custom questions from all categories (including custom categories)
      const customCategories = questionStorage.getCustomCategories()
      Object.keys(customQuestions).forEach(cat => {
        customQuestions[cat].forEach(q => {
          const categoryName = questionCategories[cat]?.name || customCategories[cat]?.name || cat
          questions.push({
            text: q.text,
            category: cat,
            categoryName: categoryName
          })
        })
      })
    } else if (activeCategory) {
      // Check if it's a custom category
      const customCategories = questionStorage.getCustomCategories()
      const isCustomCategory = customCategories[activeCategory]?.isCustom
      
      if (isCustomCategory) {
        // Custom category - get questions from questionStorage only
        if (customQuestions[activeCategory]) {
          questions = customQuestions[activeCategory].map(q => ({
            text: q.text,
            category: activeCategory,
            categoryName: customCategories[activeCategory].name
          }))
        }
      } else {
        // Regular category - get questions from questionCategories
        const categoryQuestions = questionCategories[activeCategory]?.questions || []
        questions = categoryQuestions.map(q => ({
          text: q,
          category: activeCategory,
          categoryName: questionCategories[activeCategory].name
        }))
        // Add custom questions for this category
        if (customQuestions[activeCategory]) {
          customQuestions[activeCategory].forEach(q => {
            questions.push({
              text: q.text,
              category: activeCategory,
              categoryName: questionCategories[activeCategory].name
            })
          })
        }
      }
    }

    return questions.filter(q => !usedQuestions.has(q.text))
  }

  // Get next question
  const getNextQuestion = (category = undefined, shuffle = undefined) => {
    const availableQuestions = getAvailableQuestions(category, shuffle)
    
    if (availableQuestions.length === 0) {
      // Reset used questions if all have been used
      setUsedQuestions(new Set())
      const freshQuestions = getAvailableQuestions(category, shuffle)
      if (freshQuestions.length === 0) {
        setCurrentQuestion(null)
        return
      }
      const randomQuestion = freshQuestions[Math.floor(Math.random() * freshQuestions.length)]
      setCurrentQuestion(randomQuestion)
      setUsedQuestions(new Set([randomQuestion.text]))
      return
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    setCurrentQuestion(randomQuestion)
    setUsedQuestions(new Set([...usedQuestions, randomQuestion.text]))
  }

  // Start game with category or shuffle mode
  const startGame = (category, shuffle = false) => {
    setSelectedCategory(category)
    setShuffleMode(shuffle)
    setUsedQuestions(new Set())
    setCurrentTurnIndex(0)
    // Pass category and shuffle directly to avoid async state issue
    getNextQuestion(category, shuffle)
  }

  // Change category mid-game
  const changeCategory = (category, shuffle = false) => {
    setSelectedCategory(category)
    setShuffleMode(shuffle)
    // Reset used questions when changing category
    setUsedQuestions(new Set())
    // Pass category and shuffle directly to avoid async state issue
    getNextQuestion(category, shuffle)
  }

  // Get winner (player with most points)
  const getWinner = () => {
    if (players.length === 0) return null
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points)
    const maxPoints = sortedPlayers[0].points
    // Return all players with max points (in case of tie)
    return sortedPlayers.filter(p => p.points === maxPoints)
  }

  // Reset game completely (restart from scratch)
  const resetGame = () => {
    setPlayers([])
    setCurrentTurnIndex(0)
    setSelectedCategory(null)
    setShuffleMode(false)
    setCurrentQuestion(null)
    setUsedQuestions(new Set())
    localStorage.removeItem('never-have-i-ever-players')
  }

  // Reset all players
  const resetPlayers = () => {
    setPlayers([])
    setCurrentTurnIndex(0)
    localStorage.removeItem('never-have-i-ever-players')
  }

  const value = {
    players,
    currentTurnIndex,
    selectedCategory,
    shuffleMode,
    currentQuestion,
    addPlayer,
    removePlayer,
    getCurrentPlayer,
    nextTurn,
    handleIHave,
    handleIHavent,
    startGame,
    changeCategory,
    resetGame,
    resetPlayers,
    getNextQuestion,
    getWinner
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

