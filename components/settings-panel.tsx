"use client"

import { useEffect, useState } from "react"
import { Settings2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useEditorSettings } from '@/hooks/use-editor-settings'

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px"].map(size => ({
  value: size,
  label: size
}))
const EDITOR_THEMES = ["default", "monokai", "github", "dracula"]

interface SettingsState {
  fontSize: string
  editorTheme: string
  showLineNumbers: boolean
}


export function SettingsPanel() {
  const { settings, updateSettings } = useEditorSettings()

  // Remove this useEffect as it's no longer needed
  // useEffect(() => {
  //   const savedSettings = localStorage.getItem("formatter-settings")
  //   if (savedSettings) {
  //     const parsed = JSON.parse(savedSettings)
  //     setSettings(parsed)
  //     onSettingsChange(parsed)
  //   }
  // }, [onSettingsChange])

  // const updateSettings = (newSettings: Partial<SettingsState>) => {
  //   const updated = { ...settings, ...newSettings }
  //   setSettings(updated)
  //   localStorage.setItem("formatter-settings", JSON.stringify(updated))
  //   onSettingsChange(updated)
  // }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Font Size</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {FONT_SIZES.map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size.value}
                    checked={settings.fontSize === size.value}
                    onCheckedChange={() => updateSettings({ fontSize: size.value })}
                  >
                    {size.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Editor Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {EDITOR_THEMES.map((theme) => (
                  <DropdownMenuCheckboxItem
                    key={theme}
                    checked={settings.editorTheme === theme}
                    onCheckedChange={() => updateSettings({ editorTheme: theme })}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuCheckboxItem
            checked={settings.showLineNumbers}
            onCheckedChange={(checked) => updateSettings({ showLineNumbers: checked })}
          >
            Show Line Numbers
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

