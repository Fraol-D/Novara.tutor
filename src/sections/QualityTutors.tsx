import { motion } from 'framer-motion'
import { ShieldCheck, NotebookPen, MessageCircle } from 'lucide-react'

const items = [
  { icon: ShieldCheck, text: 'Carefully selected tutors' },
  { icon: NotebookPen, text: 'Session notes + progress tracking' },
  { icon: MessageCircle, text: 'Parent-friendly communication' },
]

export default function QualityTutors() {
  return (
    <section className="py-16 sm:py-20 bg-[#f8fafa] dark:bg-gray-800 transition-colors">
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-text dark:text-text-dark">Quality Tutors, Clear Outcomes</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Every session stays aligned to the diagnostic plan.
          </p>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.text}
                className="rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary-dark/15 text-primary dark:text-primary-dark">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-base font-semibold text-text dark:text-text-dark">{item.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
