import { motion } from 'framer-motion'
import { CalendarClock, ListChecks, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: CalendarClock,
    title: 'Book a free diagnostic (20 minutes)',
    description: 'Pick a time and share your subject focus.',
  },
  {
    icon: ListChecks,
    title: 'Get a clear learning plan',
    description: 'We outline strengths, gaps, and next steps for your child.',
  },
  {
    icon: Sparkles,
    title: 'Continue with tutoring (optional)',
    description: '1-on-1 sessions starting at $25/hr — only if you want to continue.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-manuscript">
      <div className="container">
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-4">Method</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-[color:var(--on-surface-soft)]">
            Clear next steps from diagnostic to tutoring — no subscription required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                className="relative surface-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-start text-left">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl surface-tier-high flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[color:var(--primary)]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[color:var(--primary)] text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-[color:var(--on-surface-soft)]">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%+1rem)] w-8">
                    <svg className="w-full h-6 text-[color:var(--outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
