import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-[#f4fafa] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <svg className="absolute top-10 right-10 w-32 h-32 text-primary/10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-20 left-10 w-24 h-24 text-accent/10" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="currentColor" />
        </svg>
      </div>
      
      <div className="container relative py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-text dark:text-text-dark leading-tight">
              Free 20-Minute Academic Diagnostic (No obligation)
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              A quick 1-on-1 assessment to identify learning gaps and recommend the best next steps for your child.
            </p>
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Online • Middle & High School • Zoom
            </p>
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <a
                href="#booking"
                className="btn-primary !px-8 !py-4 !text-lg"
              >
                Book Free Diagnostic
              </a>
              <Link to="/app" className="btn-secondary !px-6 !py-4 !text-base">
                Open Dashboard
              </Link>
              <a
                href="#how-it-works"
                className="text-primary dark:text-primary-dark hover:text-accent dark:hover:text-accent font-semibold transition-colors"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Right Column: Illustration */}
          <motion.div
            className="relative rounded-3xl p-6 backdrop-blur-sm overflow-hidden max-w-[500px] mx-auto bg-gradient-to-br from-text via-sidebar to-primary-dark"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="/illu.png" 
              alt="Students learning online" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
