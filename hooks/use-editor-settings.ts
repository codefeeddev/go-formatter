'use client'

import { useLocalStorage } from './use-local-storage'

export interface EditorSettings {
  fontSize: string
  editorTheme: string
  showLineNumbers: boolean
}

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: '14px',  // Ensure px unit is included
  editorTheme: 'default',
  showLineNumbers: true,
}

export function useEditorSettings() {
  const [settings, setSettings] = useLocalStorage<EditorSettings>(
    'editor-settings',
    DEFAULT_SETTINGS
  )

  return {
    settings,
    updateSettings: (newSettings: Partial<EditorSettings>) => {
      setSettings(current => ({
        ...current,
        ...newSettings,
      }))
    },
  }
}

