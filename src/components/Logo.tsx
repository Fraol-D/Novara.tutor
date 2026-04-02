export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <img
        src="/logo-navbar.png"
        alt="NovaraTutor Logo"
        className={className}
      />
      <div className="leading-none">
        <span className="block text-base font-semibold tracking-tight [font-family:var(--font-display)]">Novara</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[color:var(--on-surface-soft)]">Tutor Studio</span>
      </div>
    </div>
  )
}
