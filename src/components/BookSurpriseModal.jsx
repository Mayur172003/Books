import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import './BookSurpriseModal.css'

const ROSE_COUNT = 26

function makeRoses(seed) {
  return Array.from({ length: ROSE_COUNT }, (_, i) => {
    const r = ((i * 7919 + seed) % 1000) / 1000
    const r2 = ((i * 4177 + seed) % 1000) / 1000
    return {
      id: `${seed}-${i}`,
      left: `${8 + r * 84}%`,
      delay: r2 * 0.55,
      dur: 1.85 + r * 1.35,
      drift: `${(r - 0.5) * 90}px`,
      spin: `${(r - 0.5) * 200}deg`,
    }
  })
}

/**
 * Full-screen book opens → roses fall → quote appears.
 */
export function BookSurpriseModal({ isOpen, onClose, quote }) {
  const reduce = useReducedMotion()
  const [bookOpen, setBookOpen] = useState(false)
  const [rosesActive, setRosesActive] = useState(false)
  const [showQuote, setShowQuote] = useState(false)

  const roses = useMemo(
    () => makeRoses(quote?.text?.length ?? 0),
    [quote?.text],
  )

  useEffect(() => {
    if (!isOpen) return undefined

    let raf0 = 0
    let raf1 = 0
    let raf2 = 0
    let t1 = 0
    let t2 = 0

    raf0 = requestAnimationFrame(() => {
      setBookOpen(false)
      setRosesActive(false)
      setShowQuote(false)

      if (reduce) {
        queueMicrotask(() => {
          setBookOpen(true)
          setRosesActive(true)
          setShowQuote(true)
        })
        return
      }

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setBookOpen(true))
      })
      /* Roses after cover is nearly open; quote after a calm beat */
      t1 = window.setTimeout(() => setRosesActive(true), 2650)
      t2 = window.setTimeout(() => setShowQuote(true), 5400)
    })

    return () => {
      cancelAnimationFrame(raf0)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (t1) window.clearTimeout(t1)
      if (t2) window.clearTimeout(t2)
    }
  }, [isOpen, reduce])

  useEffect(() => {
    if (!isOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && quote && (
        <motion.div
          className="surprise-modal-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby="surprise-book-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="surprise-modal-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="surprise-modal-panel"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            <button
              type="button"
              className="surprise-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            <p id="surprise-book-title" className="surprise-modal-hint">
              {showQuote ? 'Here’s your quote ✨' : 'Watch closely…'}
            </p>

            <div className="book-scene">
              <div className={`book-3d ${bookOpen ? 'is-open' : ''}`}>
                <div className="book-spread">
                  <div className="book-page-left">
                    <motion.div
                      className="book-page-inner"
                      initial={reduce ? false : { opacity: 0.2 }}
                      animate={{ opacity: bookOpen ? 1 : 0.25 }}
                      transition={{
                        duration: reduce ? 0.01 : 1.8,
                        delay: reduce ? 0 : 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p className="book-page-kicker">Inside cover</p>
                      <p className="book-page-text">
                        A good day to read something fun. No pressure — just
                        pages.
                      </p>
                    </motion.div>
                  </div>
                  <div className="book-page-right">
                    <motion.div
                      className="book-page-inner book-page-inner--right"
                      initial={reduce ? false : { opacity: 0.15 }}
                      animate={{ opacity: bookOpen ? 1 : 0.12 }}
                      transition={{
                        duration: reduce ? 0.01 : 2,
                        delay: reduce ? 0 : 0.85,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p className="book-page-kicker">From a friend</p>
                      <p className="book-page-text">
                        Hope you find a good story today. That&apos;s it — keep
                        it simple and enjoy the book. ✨
                      </p>
                    </motion.div>
                  </div>
                  <div className="book-page-gold" aria-hidden="true" />
                </div>
                <div className="book-spine" aria-hidden="true" />
                <div
                  className={`book-cover-front ${bookOpen ? 'is-open' : ''}`}
                  aria-hidden="true"
                >
                  <span className="book-cover-spine-edge" />
                  <span className="book-cover-emboss">
                    A little
                    <br />
                    magic
                  </span>
                </div>

                {rosesActive && (
                  <div className="rose-rain" aria-hidden="true">
                    {roses.map((r) => (
                      <span
                        key={r.id}
                        className={`rose-petal ${rosesActive ? 'is-falling' : ''}`}
                        style={{
                          left: r.left,
                          '--delay': `${r.delay}s`,
                          '--dur': `${r.dur}s`,
                          '--drift': r.drift,
                          '--spin': r.spin,
                        }}
                      >
                        🌹
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showQuote && (
                <motion.div
                  className="surprise-modal-quote"
                  initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="surprise-text">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="surprise-meta">
                    — <em>{quote.book}</em>, {quote.author}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
