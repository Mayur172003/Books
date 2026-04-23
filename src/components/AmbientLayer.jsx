import { motion, useReducedMotion } from 'framer-motion'

const FLOATS = [
  { emoji: '✨', top: '6%', left: '4%', delay: 0, duration: 16 },
  { emoji: '📖', top: '72%', left: '3%', delay: 1.2, duration: 19 },
  { emoji: '⭐', top: '18%', right: '5%', delay: 0.4, duration: 14 },
  { emoji: '✨', top: '45%', right: '8%', delay: 2, duration: 17 },
  { emoji: '📚', top: '82%', right: '12%', delay: 0.8, duration: 21 },
  { emoji: '✨', top: '30%', left: '12%', delay: 1.5, duration: 18 },
  { emoji: '⭐', top: '58%', left: '8%', delay: 2.2, duration: 15 },
  { emoji: '📖', top: '12%', left: '48%', delay: 0.2, duration: 20 },
]

export function AmbientLayer() {
  const reduce = useReducedMotion()

  return (
    <div className="ambient-layer" aria-hidden="true">
      {FLOATS.map((f, i) => (
        <motion.span
          key={`${f.emoji}-${i}`}
          className="ambient-float"
          style={{
            top: f.top,
            ...(f.left != null ? { left: f.left } : {}),
            ...(f.right != null ? { right: f.right } : {}),
          }}
          initial={false}
          animate={
            reduce
              ? { opacity: 0.22 }
              : {
                  y: [0, -22, 0, 16, 0],
                  x: [0, 14, 0, -12, 0],
                  rotate: [0, 10, 0, -8, 0],
                  opacity: [0.28, 0.5, 0.32, 0.48, 0.28],
                  scale: [1, 1.08, 1, 1.05, 1],
                }
          }
          transition={{
            duration: f.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: f.delay,
          }}
        >
          {f.emoji}
        </motion.span>
      ))}
      {!reduce && <SparkleField />}
    </div>
  )
}

function SparkleField() {
  const dots = [
    { t: '12%', l: '22%', s: 0.6, d: 0 },
    { t: '28%', l: '78%', s: 0.4, d: 0.4 },
    { t: '55%', l: '18%', s: 0.5, d: 0.8 },
    { t: '68%', l: '65%', s: 0.35, d: 1.1 },
    { t: '88%', l: '40%', s: 0.45, d: 0.3 },
    { t: '40%', l: '92%', s: 0.5, d: 1.4 },
    { t: '8%', l: '55%', s: 0.3, d: 0.6 },
  ]

  return (
    <div className="ambient-sparkles">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="ambient-sparkle-dot"
          style={{ top: d.t, left: d.l, width: d.s * 6, height: d.s * 6 }}
          animate={{
            opacity: [0.15, 0.65, 0.2, 0.55, 0.15],
            scale: [0.85, 1.25, 0.9, 1.15, 0.85],
          }}
          transition={{
            duration: 3.2 + i * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.d,
          }}
        />
      ))}
    </div>
  )
}
