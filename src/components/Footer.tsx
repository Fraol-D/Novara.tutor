export default function Footer() {
  return (
    <footer className="surface-tier-low border-t border-[color:var(--outline-ghost)]">
      <div className="container flex flex-col gap-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="text-[color:var(--on-surface-soft)]">
          © {new Date().getFullYear()} NovaraTutor. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center gap-5 text-[color:var(--on-surface-soft)] md:justify-end">
          <a href="#how-it-works" className="transition-colors hover:text-[color:var(--primary)]">
            How It Works
          </a>
          <a href="#diagnostic" className="transition-colors hover:text-[color:var(--primary)]">
            What You Get
          </a>
          <a href="#pricing" className="transition-colors hover:text-[color:var(--primary)]">
            Pricing
          </a>
          <a href="#booking" className="transition-colors hover:text-[color:var(--primary)]">
            Book Diagnostic
          </a>
        </div>
      </div>
    </footer>
  )
}
