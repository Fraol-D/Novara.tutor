export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <img 
        src="/logo-navbar.png" 
        alt="NovaraTutor Logo" 
        className={className}
      />
      <span className="text-lg font-semibold tracking-tight">NovaraTutor</span>
    </div>
  )
}
