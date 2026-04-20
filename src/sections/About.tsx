import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="container grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-text dark:text-text-dark">About Getdodos</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Getdodos is an innovative online tutoring platform focused on 1-to-1 mentorship and
            academic growth. We match students with top tutors who are passionate about helping them
            succeed.
          </p>
        </motion.div>
        <motion.div
          className="rounded-xl bg-primary/10 dark:bg-primary-dark/10 border border-primary/20 dark:border-primary-dark/20 p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-primary dark:text-primary-dark font-medium">Built for students who want to grow</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Our approach blends personalized lesson plans with consistent mentorship to build
            confidence and real results.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
