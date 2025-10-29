import { motion } from 'framer-motion'

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-white dark:bg-gray-900 transition-colors opacity-40">
      <div className="container">
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-center text-text dark:text-text-dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          What Students Say
        </motion.h2>
        <motion.div
          className="mt-10 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 italic">
            Our first student reviews will appear here soon.
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
            We&rsquo;re just getting started and can&rsquo;t wait to share success stories from our students!
          </p>
        </motion.div>
      </div>
    </section>
  )
}
