import confetti from 'canvas-confetti'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const SLIDE_COUNT = 4

const ORBIT_ICONS = ['✨', '📚', '⭐', '📖', '✨', '⭐']

function fireConfetti(soft = false) {
  const count = soft ? 55 : 120
  const base = {
    particleCount: count,
    spread: 72,
    startVelocity: soft ? 18 : 28,
    origin: { y: 0.58, x: 0.5 },
    colors: ['#e5b5bc', '#fceaea', '#ffffff', '#c4b0dc', '#a890c8', '#f8d4dc'],
    ticks: 220,
    gravity: 0.9,
    scalar: 0.95,
  }
  confetti(base)
  setTimeout(() => {
    confetti({
      ...base,
      particleCount: Math.round(count * 0.45),
      spread: 100,
      origin: { y: 0.52, x: 0.35 },
    })
  }, 160)
  setTimeout(() => {
    confetti({
      ...base,
      particleCount: Math.round(count * 0.45),
      spread: 100,
      origin: { y: 0.52, x: 0.65 },
    })
  }, 320)
}

function OrbitRing({ reduce }) {
  return (
    <div className="joy-orbit-stage" aria-hidden="true">
      <motion.div
        className="joy-orbit-ring"
        animate={reduce ? { rotate: 0 } : { rotate: 360 }}
        transition={
          reduce
            ? {}
            : { duration: 28, repeat: Infinity, ease: 'linear' }
        }
      >
        {ORBIT_ICONS.map((icon, i) => {
          const deg = (360 / ORBIT_ICONS.length) * i
          return (
            <span
              key={`${icon}-${i}`}
              className="joy-orbit-node"
              style={{
                transform: `rotate(${deg}deg) translateY(calc(-1 * var(--orbit-radius, 76px)))`,
              }}
            >
              <motion.span
                className="joy-orbit-emoji"
                animate={
                  reduce ? undefined : { scale: [1, 1.18, 1] }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        delay: i * 0.22,
                        ease: 'easeInOut',
                      }
                }
              >
                {icon}
              </motion.span>
            </span>
          )
        })}
      </motion.div>
      <motion.div
        className="joy-orbit-core"
        animate={
          reduce
            ? undefined
            : {
                scale: [1, 1.08, 1],
                rotate: [0, 6, -6, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        📖
      </motion.div>
    </div>
  )
}

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    rotateY: dir > 0 ? -14 : 14,
    scale: 0.92,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 26,
      stiffness: 220,
      mass: 0.85,
    },
  },
  exit: (dir) => ({
    x: dir < 0 ? 100 : -100,
    opacity: 0,
    rotateY: dir < 0 ? 12 : -12,
    scale: 0.9,
    filter: 'blur(6px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

function SlideContent({ index, reduce }) {
  if (index === 0) {
    return (
      <div className="joy-slide-inner">
        <motion.p
          className="joy-burst-line"
          initial={reduce ? false : { scale: 0.2, opacity: 0, rotate: -18 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.55, stiffness: 200, damping: 14 }}
        >
          <span className="joy-burst-kicker">There you are,</span>
          <span className="joy-burst-main">captain&nbsp;bookshelf&nbsp;🎉</span>
        </motion.p>
        <motion.p
          className="joy-slide-sub"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          Honest disclaimer: <strong>I</strong> barely read — you&apos;re the one
          who actually lives in stories. So yes, this tiny book corner is a bit
          ridiculous coming from me… but it&apos;s basically here to tease me
          and cheer <strong>you</strong> on. Enjoy while I stay Team &ldquo;I&apos;ll
          read that later&rdquo; forever. 📚
        </motion.p>
        <motion.div
          className="joy-pop-row"
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.25 },
            },
          }}
        >
          {['✨', '📚', '⭐', '✨'].map((e, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 400, damping: 12 },
                },
              }}
              className="joy-pop-emoji"
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="joy-slide-inner">
        <motion.div
          className="joy-chip"
          initial={reduce ? false : { rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          style={{ transformPerspective: 420 }}
        >
          Books · Reading · Good vibes
        </motion.div>
        <motion.p
          className="joy-slide-title joy-slide-title--md"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 22 }}
        >
          For anyone who likes a good story
        </motion.p>
        <motion.p
          className="joy-slide-sub"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          Pick up whatever you&apos;re into and read a few pages — no occasion
          needed.
        </motion.p>
      </div>
    )
  }

  if (index === 2) {
    const words = ['For', 'the', 'Love', 'of', 'Books']
    return (
      <div className="joy-slide-inner">
        <motion.p
          className="joy-micro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Drumroll, please… 🥁
        </motion.p>
        <div className="joy-title-words" aria-label="For the Love of Books">
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              className="joy-title-word"
              initial={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 0, y: 64, rotate: -22, scale: 0.5 }
              }
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{
                delay: reduce ? 0 : 0.06 + i * 0.09,
                type: 'spring',
                bounce: 0.42,
                stiffness: 260,
                damping: 15,
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="joy-wiggle-caption"
          animate={
            reduce ? undefined : { y: [0, -4, 0, -3, 0] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          (Yes, that title just did a cartwheel for you.)
        </motion.p>
      </div>
    )
  }

  return (
    <div className="joy-slide-inner joy-slide-inner--quote">
      <motion.div
        className="joy-quote-card"
        initial={reduce ? false : { rotateY: -88, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        style={{ transformPerspective: 900 }}
      >
        <blockquote className="joy-quote-block">
          <p>
            &ldquo;Never trust anyone who has not brought a book with them.(Except me😁)&rdquo;
          </p>
        </blockquote>
      </motion.div>
      <motion.p
        className="joy-outro-line"
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
      >
        So I guess I should trust you — you&apos;ve basically got a book in each
        hand and three in the bag. 📚
      </motion.p>
      <motion.p
        className="joy-outro-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Read whatever you want; I&apos;ll still pretend I&apos;m totally caught
        up when you summarize it for me. ✨
      </motion.p>
    </div>
  )
}

export function Landing() {
  const reduce = useReducedMotion()
  const [[page, direction], setPage] = useState([0, 0])
  const [paused, setPaused] = useState(false)
  const burstRef = useRef(new Set())

  const index = page

  const paginate = useCallback((newDirection) => {
    setPage(([p]) => {
      const next = (p + newDirection + SLIDE_COUNT) % SLIDE_COUNT
      return [next, newDirection]
    })
  }, [])

  useEffect(() => {
    if (paused || reduce) return undefined
    const t = setInterval(() => {
      paginate(1)
    }, 4800)
    return () => clearInterval(t)
  }, [paused, paginate, index, reduce])

  useEffect(() => {
    if (reduce) return
    if (index === 0 && !burstRef.current.has('0')) {
      burstRef.current.add('0')
      const t = setTimeout(() => fireConfetti(true), 450)
      return () => clearTimeout(t)
    }
    if (index === 3 && !burstRef.current.has('3')) {
      burstRef.current.add('3')
      const t = setTimeout(() => fireConfetti(false), 500)
      return () => clearTimeout(t)
    }
    return undefined
  }, [index, reduce])

  const moreSparkle = useCallback(() => {
    if (!reduce) fireConfetti(false)
  }, [reduce])

  return (
    <header
      className="joy-hero section-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <OrbitRing reduce={!!reduce} />

      <div className="joy-stage-wrap">
        <div className="joy-progress" aria-hidden="true">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <motion.button
              key={i}
              type="button"
              className={`joy-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setPage([i, i > index ? 1 : -1])}
              aria-label={`Go to moment ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              whileHover={reduce ? {} : { scale: 1.15 }}
              whileTap={reduce ? {} : { scale: 0.92 }}
            >
              <motion.span
                className="joy-dot-fill"
                animate={{
                  scale: i === index ? 1 : 0.35,
                  opacity: i === index ? 1 : 0.35,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            </motion.button>
          ))}
        </div>

        <div className="joy-stage" aria-live="polite">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="joy-slide"
            >
              <SlideContent index={index} reduce={!!reduce} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="joy-controls">
          <motion.button
            type="button"
            className="joy-nav joy-nav--prev"
            onClick={() => paginate(-1)}
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={reduce ? {} : { scale: 0.94 }}
            aria-label="Previous moment"
          >
            ←
          </motion.button>
          <motion.button
            type="button"
            className="joy-nav joy-nav--sparkle"
            onClick={moreSparkle}
            whileHover={reduce ? {} : { scale: 1.05, rotate: [-2, 2, -2, 0] }}
            whileTap={reduce ? {} : { scale: 0.95 }}
            transition={{ rotate: { duration: 0.5 } }}
          >
            More sparkle ✨
          </motion.button>
          <motion.button
            type="button"
            className="joy-nav joy-nav--next"
            onClick={() => paginate(1)}
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={reduce ? {} : { scale: 0.94 }}
            aria-label="Next moment"
          >
            →
          </motion.button>
        </div>

        <p className="joy-hint">
          {paused ? 'Auto-play paused while you explore' : 'Moments advance on their own — or use the arrows'}
        </p>
      </div>
    </header>
  )
}
