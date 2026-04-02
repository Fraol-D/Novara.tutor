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
    <section id="pricing" className="section-manuscript">
      <div className="container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">Simple pricing</h2>
          <p className="mt-4 text-lg text-[color:var(--on-surface-soft)]">No subscription required.</p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {pricing.map((item, index) => (
            <motion.div
              key={item.title}
              className="surface-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <span className="text-sm text-[color:var(--on-surface-soft)]">{item.detail}</span>
              </div>
              <p className="mt-3 text-3xl font-bold text-[color:var(--primary)]">{item.price}</p>
              <p className="mt-2 text-sm text-[color:var(--on-surface-soft)]">{item.note}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="#booking"
            className="btn-primary !px-7 !py-3"
          >
            Book Free Diagnostic <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
