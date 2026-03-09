import { LaptopMinimal, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggleFab() {
  const { theme, preference, toggleTheme, setPreference } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-2 py-1 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-accent/10 hover:text-accent dark:text-gray-200"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <button
        type="button"
        onClick={() => setPreference('system')}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
          preference === 'system'
            ? 'bg-primary/15 text-primary'
            : 'text-gray-500 hover:bg-primary/10 hover:text-primary dark:text-gray-400'
        }`}
        aria-label="Use system theme"
      >
        <LaptopMinimal size={16} />
      </button>
    </div>
  )
}
