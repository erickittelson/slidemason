import { motion } from 'framer-motion';

const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const slides = [
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: 'clamp(2rem, 5vw, 5rem)' }}>
    <motion.h1
      {...fade}
      className="font-extrabold"
      style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
      }}
    >
      New Deck
    </motion.h1>
  </div>,
];

export default slides;
