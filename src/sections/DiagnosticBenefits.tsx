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
    <section id="diagnostic" className="section-manuscript surface-tier-container">
      <div className="container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-4">Outcomes</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">What you get in the diagnostic</h2>
          <p className="mt-4 text-lg text-[color:var(--on-surface-soft)]">
            A concise, actionable assessment you can use immediately.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
          {benefits.map((item, index) => (
            <motion.div
              key={item}
              className="surface-card !p-5 flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 text-[color:var(--primary)]" />
              <p className="text-base">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
