import { motion } from 'framer-motion'

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
              Affordable 1:1 Tutoring for U.S. Students — Try Your First Lesson{' '}
              <span className="text-primary dark:text-primary-dark">Free</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Expert tutors. Personalized sessions. Real improvement — right from your home.
            </p>
            <div className="mt-8">
              <a
                href="#booking"
                className="inline-flex items-center rounded-lg bg-primary hover:bg-accent dark:bg-primary-dark dark:hover:bg-accent px-8 py-4 text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Book a Free Lesson
              </a>
            </div>
          </motion.div>

          {/* Right Column: Illustration */}
          <motion.div
            className="relative rounded-3xl p-6 backdrop-blur-sm overflow-hidden max-w-[500px] mx-auto"
            style={{ background: 'linear-gradient(135deg, #2e2f30 0%, #00e1ff 100%)' }}
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
