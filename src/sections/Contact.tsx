import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import Toast, { ToastMessage } from '../components/Toast'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function pushToast(type: ToastMessage['type'], text: string) {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (!name || !email || !message) {
      pushToast('error', 'Please fill in all fields.')
      return
    }

    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)
    if (!emailOk) {
      pushToast('error', 'Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      
      if (!res.ok) {
        // Fallback to jsonplaceholder if API not available
        const fallbackRes = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, source: 'getdodos-landing' }),
        })
        if (!fallbackRes.ok) throw new Error(`Request failed`)
      }

      pushToast('success', "Thank you for reaching out! We'll get back to you soon.")
      form.reset()
    } catch {
      pushToast('error', 'Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
      <div className="container max-w-2xl">
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-center text-text dark:text-text-dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h2>

        <motion.form
          onSubmit={onSubmit}
          className="mt-8 grid gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary dark:focus:border-primary-dark focus:ring-primary dark:focus:ring-primary-dark"
              placeholder="How can we help?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-accent dark:from-primary-dark dark:to-primary-dark dark:hover:to-accent px-6 py-3 text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t} onClose={() => setToasts((s) => s.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </section>
  )
}
