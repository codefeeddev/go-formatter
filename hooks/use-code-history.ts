'use client'

import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './use-local-storage'

interface CodeHistory {
  history: string[]
  currentIndex: number
}

export function useCodeHistory(initialCode: string = '') {
  const [{ history, currentIndex }, setHistoryState] = useLocalStorage<CodeHistory>('code-history', {
    history: initialCode ? [initialCode] : [''],
    currentIndex: 0,
  })

  useEffect(() => {
    // If there's initial code and history is empty or just has an empty string
    if (initialCode && (history.length === 0 || (history.length === 1 && history[0] === ''))) {
      setHistoryState({
        history: [initialCode],
        currentIndex: 0,
      })
    }
  }, [initialCode, history, setHistoryState])

  const updateCode = useCallback((newCode: string) => {
    setHistoryState(prev => {
      // Don't add to history if the code is the same as current
      if (prev.history[prev.currentIndex] === newCode) {
        return prev
      }

      // If we're not at the end of the history, remove future entries
      const newHistory = prev.history.slice(0, prev.currentIndex + 1)
      
      return {
        // Add the new code to history
        history: [...newHistory, newCode],
        // Move the index to the new entry
        currentIndex: prev.currentIndex + 1,
      }
    })
    return newCode
  }, [setHistoryState])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setHistoryState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
      }))
      return history[currentIndex - 1]
    }
    return history[currentIndex]
  }, [currentIndex, history, setHistoryState])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setHistoryState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }))
      return history[currentIndex + 1]
    }
    return history[currentIndex]
  }, [currentIndex, history, setHistoryState])

  const clear = useCallback(() => {
    setHistoryState(prev => ({
      // Add empty string as a new history entry
      history: [...prev.history, ''],
      // Move to the new empty entry
      currentIndex: prev.history.length,
    }))
    return ''
  }, [setHistoryState])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1
  const currentCode = history[currentIndex] || ''

  return {
    code: currentCode,
    updateCode,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  }
}

