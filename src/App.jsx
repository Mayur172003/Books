import './App.css'
import { motion, useReducedMotion } from 'framer-motion'
import { AmbientLayer } from './components/AmbientLayer'
import { HiddenMessage } from './components/HiddenMessage'
import { Landing } from './components/Landing'
import { SurpriseQuote } from './components/SurpriseQuote'

function App() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="app"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0.01 : 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="app-bg" aria-hidden="true" />
      <AmbientLayer />
      <motion.main
        className="app-main"
        initial={reduce ? false : { opacity: 0, y: 28, filter: 'blur(10px)' }}
        animate={reduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          delay: 0.12,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Landing />
        <SurpriseQuote />
        <motion.footer
          className="app-footer"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <HiddenMessage />
          <motion.p
            className="footer-note"
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.65, 1, 0.75, 1, 0.65],
                  }
            }
            transition={
              reduce
                ? undefined
                : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            For the Love of Books ✨
          </motion.p>
        </motion.footer>
      </motion.main>
    </motion.div>
  )
}

export default App
