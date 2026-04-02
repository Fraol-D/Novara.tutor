import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'What You Get', href: '#diagnostic' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-4 z-50 px-3 sm:px-6"
    >
      <nav className="container glass-card flex items-center justify-between px-5 py-3 sm:px-7">
        <Link to="/" className="flex items-center gap-2" aria-label="NovaraTutor home">
          <Logo className="h-9 w-9" />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[color:var(--on-surface-soft)] transition-colors hover:text-[color:var(--primary)]"
            >
              {item.label}
            </a>
          ))}
          <Link to="/login" className="btn-primary">
            Sign In <span className="ml-2">→</span>
          </Link>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full p-2 text-[color:var(--on-surface)] hover:bg-[color:var(--surface-low)]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M3.75 6.75h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75z" />
            </svg>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
          >
            <div className="container mt-2 glass-card py-3 flex flex-col gap-2 px-5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-[color:var(--on-surface-soft)] hover:text-[color:var(--primary)]"
                >
                  {item.label}
                </a>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="mt-2 w-max btn-primary">
                Sign In <span className="ml-2">→</span>
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
