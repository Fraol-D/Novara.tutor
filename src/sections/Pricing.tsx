import { motion } from 'framer-motion'

const pricing = [
  {
    title: 'Free Diagnostic',
    price: '$0',
    detail: '20 minutes',
    note: 'Learning gaps + next steps',
  },
  {
    title: '1-on-1 Tutoring Session',
    price: '$25',
    detail: '60 minutes (starting)',
    note: 'Only after you approve the plan',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-text dark:text-text-dark">Simple pricing</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">No subscription required.</p>
        </motion.div>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pricing.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl font-semibold text-text dark:text-text-dark">{item.title}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.detail}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-primary dark:text-primary-dark">{item.price}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.note}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#booking"
            className="inline-flex items-center rounded-lg bg-primary hover:bg-accent dark:bg-primary-dark dark:hover:bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Book Free Diagnostic
          </a>
        </div>
      </div>
    </section>
  )
}
