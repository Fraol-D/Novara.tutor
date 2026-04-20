import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [cursor, setCursor] = useState({ x: -999, y: -999 })
  const [burst, setBurst] = useState({ x: -999, y: -999, radius: 100, active: false, tick: 0 })

  const headline = 'Free 20-Minute Academic Diagnostic (No obligation)'
  const words = useMemo(() => headline.split(' '), [headline])
  const stars = useMemo(
    () =>
      Array.from({ length: 39 }, (_, index) => ({
        id: index,
        x: (index * 37) % 100,
        y: (index * 19 + 11) % 100,
      })),
    []
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setCursor({ x: -999, y: -999 })
  }

  const handlePop = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setBurst((prev) => ({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      radius: 100,
      active: true,
      tick: prev.tick + 1,
    }))

    window.setTimeout(() => {
      setBurst((prev) => ({ ...prev, active: false }))
    }, 280)
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden section-manuscript !pt-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handlePop}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((star) => {
          const starX = (star.x / 100) * (typeof window === 'undefined' ? 1200 : window.innerWidth)
          const starY = (star.y / 100) * 720
          const dx = starX - cursor.x
          const dy = starY - cursor.y
          const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
          const repel = Math.max(0, 25 - distance / 14)
          const pushX = (dx / distance) * repel
          const pushY = (dy / distance) * repel
          const burstDistance = Math.sqrt((starX - burst.x) ** 2 + (starY - burst.y) ** 2)
          const inBurst = burst.active && burstDistance < burst.radius
          const burstDelay = Math.min((burstDistance / burst.radius) * 170, 170)

          return (
            <span
              key={`${star.id}-${burst.tick}`}
              aria-hidden="true"
              className="absolute text-xs text-[color:var(--primary)]/45 transition-all duration-200"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: `translate(${pushX}px, ${pushY}px)`,
                opacity: inBurst ? 0 : 0.5,
                transitionProperty: 'opacity, transform',
                transitionDuration: burst.active ? '120ms, 200ms' : '140ms, 200ms',
                transitionTimingFunction: 'ease, ease-out',
                transitionDelay: burst.active ? `${burstDelay}ms, 0ms` : '0ms, 0ms',
              }}
            >
              ✶
            </span>
          )
        })}
      </div>

      <div className="container relative py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Getdodos Studio</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              <span className="h1-drop">
                {words.map((word, wordIndex) => {
                  const charOffset = words.slice(0, wordIndex).join('').length + wordIndex

                  return (
                    <span key={`${word}-${wordIndex}`} className="inline-flex whitespace-nowrap mr-[0.28em]">
                      {word.split('').map((char, charIndex) => (
                        <span key={`${char}-${wordIndex}-${charIndex}`} style={{ ['--i' as string]: charOffset + charIndex }}>
                          {char}
                        </span>
                      ))}
                    </span>
                  )
                })}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--on-surface-soft)]">
              A quick 1-on-1 assessment to identify learning gaps and recommend the best next steps for your child.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--on-surface-soft)]">
              Online • Middle & High School • Zoom
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#booking" className="btn-primary !px-8 !py-4 !text-base">
                Book Free Diagnostic <span className="ml-2">→</span>
              </a>
              <Link to="/app" className="btn-secondary !px-7 !py-4 !text-base">
                Open Dashboard
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-[color:var(--primary)] transition-colors hover:opacity-80"
              >
                See how it works
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-full surface-tier-container px-5 py-3">
              <div className="marquee-track text-sm uppercase tracking-[0.16em] text-[color:var(--on-surface-soft)]">
                <span>Engineered Comfort</span>
                <span>Measured Progress</span>
                <span>Parent Clarity</span>
                <span>Academic Precision</span>
                <span>Engineered Comfort</span>
                <span>Measured Progress</span>
                <span>Parent Clarity</span>
                <span>Academic Precision</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto max-w-[540px] animate-float-soft"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[color:var(--primary)]/25 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-[color:var(--primary-container)]/20 blur-3xl" />
            <article className="surface-card luminous-zoom v-wipe !p-3 sm:!p-4">
              <img src="/illu.png" alt="Students learning online" className="relative w-full h-auto rounded-[1rem]" />
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
