import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

export default function VisualSuccess() {
  return (
    <section className="py-16 sm:py-20 bg-[#f8fafa] dark:bg-gray-800 transition-colors">
      <div className="container">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Tutor Image with Verified Badge */}
            <div className="relative mx-auto md:mx-0 w-64 h-64">
              <img 
                src="/ZIO_0812.jpg"
                alt="Verified NovaraTutor instructor"
                className="w-full h-full rounded-2xl object-cover shadow-lg"
              />
              
              {/* Verified Badge */}
              <div className="absolute -bottom-3 -right-3 bg-primary dark:bg-primary-dark text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">Verified Tutor</span>
              </div>
            </div>

            {/* Success Stat */}
            <div className="text-center md:text-left">
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text dark:text-text-dark leading-tight">
                &ldquo;95% of our students report higher grades within weeks.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
                *Placeholder statistic — real data coming soon
              </p>
              <div className="mt-6">
                <a
                  href="#booking"
                  className="inline-flex items-center text-primary dark:text-primary-dark hover:text-accent dark:hover:text-accent font-medium transition-colors"
                >
                  See how we can help →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
