import { useState } from 'react'
import Logo from './Logo'

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 transition-colors">
      <nav className="container flex items-center justify-between py-3">
        <a href="#hero" className="flex items-center gap-2" aria-label="NovaraTutor home">
          <Logo className="h-10 w-10" />
        </a>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
              {item.label}
            </a>
          ))}
          <a
            href="#booking"
            className="inline-flex items-center rounded-lg bg-primary hover:bg-accent dark:bg-primary-dark dark:hover:bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Book Free Lesson
          </a>
        </div>
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M3.75 6.75h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75zm0 4.5h16.5v1.5H3.75z" />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-max items-center rounded-lg bg-primary hover:bg-accent dark:bg-primary-dark dark:hover:bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all"
            >
              Book Free Lesson
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
