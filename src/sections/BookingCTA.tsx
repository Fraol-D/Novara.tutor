import { motion } from 'framer-motion'

export default function BookingCTA() {
  return (
    <section id="booking" className="section-manuscript surface-tier-container">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <p className="eyebrow mb-4">Book Session</p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Book your free diagnostic
            </h2>
            <p className="mt-4 text-lg text-[color:var(--on-surface-soft)]">
              Fill the form and we&rsquo;ll email you within 24 hours to confirm a time.
            </p>
          </div>

          <div className="surface-card !p-2 sm:!p-3 overflow-hidden">
            <iframe
              src="https://forms.gle/RkzVcMGGd7rCsREL9"
              width="100%"
              height="800"
              frameBorder="0"
              className="w-full rounded-xl"
              title="Book Free Diagnostic Form"
            >
              Loading…
            </iframe>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[color:var(--on-surface-soft)]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[color:var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Fast response within 24 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
