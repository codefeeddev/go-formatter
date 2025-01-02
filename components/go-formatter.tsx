'use client'

import { useState, useEffect, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Copy, Download, Share2, Clipboard, RotateCcw, RotateCw, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { SettingsPanel } from './settings-panel'
import { useCodeHistory } from '@/hooks/use-code-history'
import { useEditorSettings } from '@/hooks/use-editor-settings'
import { ShareDropdown } from './share-dropdown'

interface GoFormatterProps {
  initialCode?: string
}

export function GoFormatter({ initialCode = '' }: GoFormatterProps) {
  const [formattedCode, setFormattedCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRealTime, setIsRealTime] = useState(true)
  const { settings, updateSettings } = useEditorSettings()
  const {
    code,
    updateCode,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  } = useCodeHistory()
  const { toast } = useToast()

  // Debounce function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Format code function
  const formatCode = useCallback(async (codeToFormat: string) => {
    if (!codeToFormat.trim()) {
      setFormattedCode('')
      setError('')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://codefeeddev-015953b7a981.herokuapp.com/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeToFormat }),
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setFormattedCode('')
      } else {
        setFormattedCode(data.formattedCode)
      }
    } catch (e) {
      setError('An unexpected error occurred.')
      setFormattedCode('')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced format function for real-time formatting
  const debouncedFormat = useCallback(
    debounce((code: string) => formatCode(code), 500),
    [formatCode]
  )

  // Effect for real-time formatting
  useEffect(() => {
    if (isRealTime && code) {
      debouncedFormat(code)
    }
  }, [code, isRealTime, debouncedFormat])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        updateCode(text)
      }
    } catch (err) {
      toast({
        title: "Clipboard Error",
        description: "Failed to read from clipboard",
        variant: "destructive",
      })
    }
  }

  const handleClear = () => {
    clear()
    setFormattedCode('')
    setError('')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([formattedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.go'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Formatted Go Code',
        text: formattedCode,
      })
    } catch (err) {
      toast({
        title: "Share Failed",
        description: "Failed to share the code",
        variant: "destructive",
      })
    }
  }

  const getEditorThemeClass = () => {
    switch (settings.editorTheme) {
      case 'monokai':
        return 'bg-zinc-900 text-emerald-400'
      case 'github':
        return 'bg-white text-gray-900 border-gray-200'
      case 'dracula':
        return 'bg-[#282a36] text-[#f8f8f2]'
      default:
        return 'bg-muted'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="text-2xl">Go Code Formatter</CardTitle>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <a 
            href="https://go.dev/play/" 
            className="text-sm text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Go Playground →
          </a>
          <SettingsPanel />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePaste}
              className="gap-2"
            >
              <Clipboard className="h-4 w-4" />
              <span className="hidden sm:inline">Paste</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateCode(undo())}
              disabled={!canUndo || !code}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Undo</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateCode(redo())}
              disabled={!canRedo || !code}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              <span className="hidden sm:inline">Redo</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClear}
              disabled={!code}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
            className={isRealTime ? 'bg-primary/10' : ''}
          >
            Real-time
          </Button>
        </div>

        <Textarea
          value={code}
          onChange={(e) => updateCode(e.target.value)}
          placeholder="Paste your Go code here"
          className="min-h-[160px] font-mono"
          style={{ fontSize: settings.fontSize }}
        />
        
        {!isRealTime && (
          <Button 
            onClick={() => formatCode(code)} 
            disabled={!code || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Format
          </Button>
        )}
        
        {error && (
          <div className="p-4 rounded bg-destructive/10 text-destructive">
            {error}
          </div>
        )}
        
        {formattedCode && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Formatted Result</h2>
            <pre 
              className={`p-4 rounded font-mono text-sm overflow-x-auto ${getEditorThemeClass()}`}
              style={{ 
                fontSize: settings.fontSize,
                lineHeight: 1.5,
              }}
            >
              {settings.showLineNumbers ? (
                formattedCode.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell pr-4 text-muted-foreground select-none">{i + 1}</span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))
              ) : (
                formattedCode
              )}
            </pre>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <ShareDropdown code={formattedCode} />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Related Tools</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="https://pkg.go.dev/golang.org/x/tools/gopls" 
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                gopls
              </a>
            </li>
            <li>
              <a 
                href="https://pkg.go.dev/golang.org/x/tools/cmd/goimports"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                goimports
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

