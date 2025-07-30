import { useState, useEffect } from 'react'

const SEARCH_HISTORY_KEY = 'fabl_search_history'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse search history:', error)
      }
    }
  }, [])

  const addToHistory = (query: string) => {
    if (!query.trim()) return

    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== query)
      const updated = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeFromHistory = (query: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item !== query)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}