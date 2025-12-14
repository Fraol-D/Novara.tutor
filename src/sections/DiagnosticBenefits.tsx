import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const benefits = [
  'Current level snapshot',
  'Gap list (what to fix first)',
  'Recommended weekly plan',
  'Tutor match recommendation (if you continue)',
]

export default function DiagnosticBenefits() {
  return (
    <section id="diagnostic" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-text dark:text-text-dark">What you get in the diagnostic</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            A concise, actionable assessment you can use immediately.
          </p>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((item, index) => (
            <motion.div
              key={item}
              className="flex items-start gap-3 rounded-2xl bg-gray-50 dark:bg-gray-800/80 p-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CheckCircle2 className="h-6 w-6 text-primary dark:text-primary-dark mt-0.5" />
              <p className="text-base text-text dark:text-text-dark">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
