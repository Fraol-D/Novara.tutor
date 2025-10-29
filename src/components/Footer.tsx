import { Linkedin, Instagram } from 'lucide-react'
import { siteConfig } from '../config/site'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      <div className="container py-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} NovaraTutor. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
              How It Works
            </a>
            <a href="#booking" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
              Book Lesson
            </a>
            <a href="#testimonials" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
              Testimonials
            </a>
          </div>
          
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
          
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.social.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-all"
              aria-label="X (formerly Twitter)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
