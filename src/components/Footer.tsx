export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      <div className="container py-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} NovaraTutor. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
            How It Works
          </a>
          <a href="#diagnostic" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
            What You Get
          </a>
          <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
            Pricing
          </a>
          <a href="#booking" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors">
            Book Diagnostic
          </a>
        </div>
      </div>
    </footer>
  )
}
