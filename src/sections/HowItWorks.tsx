import { motion } from 'framer-motion'
import { Calendar, UserCheck, Video } from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Book a Session',
    description: 'Choose your subject and preferred schedule.',
  },
  {
    icon: UserCheck,
    title: 'We Match You with a Skilled Tutor',
    description: 'Your child is paired with a verified tutor experienced in their grade level.',
  },
  {
    icon: Video,
    title: 'Learn Live Online',
    description: '1:1 interactive tutoring sessions that build confidence and improve grades.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="container">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-text dark:text-text-dark">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Getting started is simple. Here&rsquo;s how we help your child succeed:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary dark:text-primary-dark" />
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-text dark:text-text-dark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Arrow (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%+1rem)] w-8">
                    <svg className="w-full h-6 text-primary/30 dark:text-primary-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
