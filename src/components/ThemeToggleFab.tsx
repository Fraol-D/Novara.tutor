import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggleFab() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-5 right-5 z-[70] glass-card flex items-center rounded-full px-2 py-1">
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--on-surface)] transition hover:bg-[color:var(--surface-low)] hover:text-[color:var(--primary)]"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  )
}
