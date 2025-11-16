const CUSTOM_QUESTIONS_KEY = 'never-have-i-ever-custom-questions'
const CUSTOM_CATEGORIES_KEY = 'never-have-i-ever-custom-categories'

export const questionStorage = {
  // Get all custom questions
  getCustomQuestions: () => {
    try {
      const stored = localStorage.getItem(CUSTOM_QUESTIONS_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error loading custom questions:', error)
      return {}
    }
  },

  // Get all custom categories metadata
  getCustomCategories: () => {
    try {
      const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error loading custom categories:', error)
      return {}
    }
  },

  // Save custom categories metadata
  saveCustomCategories: (customCategories) => {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories))
      return true
    } catch (error) {
      console.error('Error saving custom categories:', error)
      return false
    }
  },

  // Create a new custom category
  createCustomCategory: (categoryKey, name, icon = '📝') => {
    const customCategories = questionStorage.getCustomCategories()
    customCategories[categoryKey] = {
      name: name,
      icon: icon,
      isCustom: true
    }
    return questionStorage.saveCustomCategories(customCategories)
  },

  // Delete a custom category
  deleteCustomCategory: (categoryKey) => {
    const customCategories = questionStorage.getCustomCategories()
    delete customCategories[categoryKey]
    return questionStorage.saveCustomCategories(customCategories)
  },

  // Save custom questions
  saveCustomQuestions: (customQuestions) => {
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(customQuestions))
      return true
    } catch (error) {
      console.error('Error saving custom questions:', error)
      return false
    }
  },

  // Add a custom question to a category
  addCustomQuestion: (category, question) => {
    const customQuestions = questionStorage.getCustomQuestions()
    if (!customQuestions[category]) {
      customQuestions[category] = []
    }
    customQuestions[category].push({
      id: Date.now().toString(),
      text: question,
      category: category
    })
    return questionStorage.saveCustomQuestions(customQuestions)
  },

  // Update a custom question
  updateCustomQuestion: (category, questionId, newText) => {
    const customQuestions = questionStorage.getCustomQuestions()
    if (customQuestions[category]) {
      const index = customQuestions[category].findIndex(q => q.id === questionId)
      if (index !== -1) {
        customQuestions[category][index].text = newText
        return questionStorage.saveCustomQuestions(customQuestions)
      }
    }
    return false
  },

  // Delete a custom question
  deleteCustomQuestion: (category, questionId) => {
    const customQuestions = questionStorage.getCustomQuestions()
    if (customQuestions[category]) {
      customQuestions[category] = customQuestions[category].filter(q => q.id !== questionId)
      if (customQuestions[category].length === 0) {
        delete customQuestions[category]
        // If it's a custom category with no questions, delete the category too
        const customCategories = questionStorage.getCustomCategories()
        if (customCategories[category]?.isCustom) {
          delete customCategories[category]
          questionStorage.saveCustomCategories(customCategories)
        }
      }
      return questionStorage.saveCustomQuestions(customQuestions)
    }
    return false
  },

  // Get custom questions for a specific category
  getCustomQuestionsByCategory: (category) => {
    const customQuestions = questionStorage.getCustomQuestions()
    return customQuestions[category] || []
  }
}


