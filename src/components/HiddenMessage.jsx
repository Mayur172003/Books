import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

export function HiddenMessage() {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(false)

  return (
    <motion.div
      className="hidden-wrap"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', damping: 24, stiffness: 200 }}
    >
      <motion.button
        type="button"
        className="hidden-trigger"
        onClick={() => setShown((s) => !s)}
        aria-expanded={shown}
        whileHover={reduce ? {} : { scale: 1.03 }}
        whileTap={reduce ? {} : { scale: 0.98 }}
        animate={
          reduce
            ? undefined
            : {
                textShadow: [
                  '0 0 0px rgba(168, 144, 200, 0)',
                  '0 0 18px rgba(168, 144, 200, 0.45)',
                  '0 0 0px rgba(168, 144, 200, 0)',
                ],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        Tap if you like books 📚
      </motion.button>

      <AnimatePresence initial={false}>
        {shown && (
          <motion.div
            key="msg"
            className="hidden-message-inner"
            role="region"
            aria-live="polite"
            initial={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 0,
                    y: 14,
                    scale: 0.97,
                    clipPath: 'inset(0 0 100% 0)',
                  }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    clipPath: 'inset(0 0 0% 0)',
                  }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -8,
                    clipPath: 'inset(100% 0 0 0)',
                  }
            }
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.p
              initial={reduce ? false : { opacity: 0, filter: 'blur(4px)' }}
              animate={reduce ? {} : { opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.1, duration: 0.45 }}
            >
              Hope you have a good day. Nothing serious — just a friend
              cheering on your reading habit.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
