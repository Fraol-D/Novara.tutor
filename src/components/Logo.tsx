import { useTheme } from '../contexts/ThemeContext'

export default function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  const { theme } = useTheme()
  const iconSrc = theme === 'dark' ? '/getdodos-icon-dark.png' : '/getdodos-icon-light.png'

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <img
        src={iconSrc}
        alt="Getdodos Logo"
        className={className}
      />
      <div className="leading-none">
        <span className="block text-base font-semibold tracking-tight [font-family:var(--font-display)]">Getdodos</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--on-surface-soft)]">Studio</span>
      </div>
    </div>
  )
}
