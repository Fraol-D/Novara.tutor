import { motion } from 'framer-motion'

const services = [
  {
    title: 'One-on-one tutoring sessions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 1116 0v1H4v-1z" />
      </svg>
    ),
  },
  {
    title: 'Personalized lesson plans',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 0v5h5" />
      </svg>
    ),
  },
  {
    title: 'Flexible scheduling for students',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M7 2v2H5a2 2 0 00-2 2v1h18V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm14 7H3v11a2 2 0 002 2h14a2 2 0 002-2V9z" />
      </svg>
    ),
  },
  {
    title: 'Expert tutors in key subjects',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2l9 4-9 4-9-4 9-4zm0 6l9 4-9 4-9-4 9-4zm9 8l-9 4-9-4" />
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-center text-text dark:text-text-dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          What We Offer
        </motion.h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="h-10 w-10 text-primary dark:text-primary-dark">{s.icon}</div>
              <p className="mt-4 font-medium text-gray-800 dark:text-gray-200">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
