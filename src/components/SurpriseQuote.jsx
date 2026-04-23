import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BookSurpriseModal } from './BookSurpriseModal'
import { SURPRISE_QUOTES } from '../data/surpriseQuotes'

function pickRandom(excludeIndex) {
  let idx = Math.floor(Math.random() * SURPRISE_QUOTES.length)
  if (
    SURPRISE_QUOTES.length > 1 &&
    excludeIndex !== null &&
    idx === excludeIndex
  ) {
    idx = (idx + 1) % SURPRISE_QUOTES.length
  }
  return idx
}

export function SurpriseQuote() {
  const reduce = useReducedMotion()
  const [showModal, setShowModal] = useState(false)
  const [showQuoteBelow, setShowQuoteBelow] = useState(false)
  const [index, setIndex] = useState(() => pickRandom(null))

  const quote = useMemo(() => SURPRISE_QUOTES[index], [index])

  function handleOpen() {
    setIndex((prev) => pickRandom(prev))
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setShowQuoteBelow(true)
  }

  return (
    <motion.section
      className="section-card surprise"
      aria-labelledby="surprise-heading"
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 200,
        mass: 0.9,
      }}
      whileHover={
        reduce
          ? {}
          : {
              y: -4,
              boxShadow: '0 20px 50px rgba(61, 53, 72, 0.1)',
              transition: { duration: 0.35 },
            }
      }
    >
      <BookSurpriseModal
        key={showModal ? `surprise-${index}` : 'idle'}
        isOpen={showModal}
        onClose={handleCloseModal}
        quote={quote}
      />

      <motion.div
        className="section-head"
        initial={reduce ? false : { opacity: 0, x: -12 }}
        whileInView={reduce ? {} : { opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 id="surprise-heading">Random book quote</h2>
        <p className="section-sub">
          Friendly little lines about books and reading — tap for a random one.
        </p>
      </motion.div>

      <motion.button
        type="button"
        className="btn btn-surprise"
        onClick={handleOpen}
        whileHover={
          reduce
            ? {}
            : {
                scale: 1.04,
                boxShadow: '0 10px 32px rgba(229, 181, 188, 0.55)',
              }
        }
        whileTap={reduce ? {} : { scale: 0.97 }}
        animate={
          reduce
            ? undefined
            : {
                boxShadow: [
                  '0 4px 18px rgba(229, 181, 188, 0.45)',
                  '0 6px 26px rgba(229, 181, 188, 0.6)',
                  '0 4px 18px rgba(229, 181, 188, 0.45)',
                ],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                boxShadow: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        Open a Surprise 📖
      </motion.button>

      <div className="surprise-panel-wrap" role="region" aria-live="polite">
        <AnimatePresence mode="wait">
          {showQuoteBelow && (
            <motion.div
              key={index}
              className="surprise-reveal"
              initial={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      y: 20,
                      scale: 0.98,
                      filter: 'blur(6px)',
                    }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -12,
                      scale: 0.98,
                      filter: 'blur(4px)',
                    }
              }
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.p
                className="surprise-text"
                initial={reduce ? false : { opacity: 0, x: 14 }}
                animate={reduce ? {} : { opacity: 1, x: 0 }}
                transition={{ delay: 0.06, duration: 0.42, ease: 'easeOut' }}
              >
                &ldquo;{quote.text}&rdquo;
              </motion.p>
              <motion.p
                className="surprise-meta"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={reduce ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.38, ease: 'easeOut' }}
              >
                — <em>{quote.book}</em>, {quote.author}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
