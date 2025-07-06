'use client';

import { motion } from 'framer-motion';

const draw = (delay: number, duration: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { delay, type: "spring", duration, bounce: 0 },
            opacity: { delay, duration: 0.01 }
        }
    }
});

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatDelay: 1,
        staggerChildren: 0.5,
      },
    },
  };

export function XenovaTrailer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
        <motion.div
            className="absolute inset-0"
            animate={{
            background: isPlaying
                ? [
                    'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.2) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.25) 0%, transparent 65%)',
                    'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.2) 0%, transparent 70%)',
                ]
                : 'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.1) 0%, transparent 70%)',
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        initial="hidden"
        animate={isPlaying ? "visible" : "hidden"}
        variants={containerVariants}
        className="text-primary"
      >
        <motion.path
          d="M50 2.5L95.5 27.5V72.5L50 97.5L4.5 72.5V27.5L50 2.5Z"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          variants={draw(0, 2.5)}
        />
        <motion.path
          d="M50 22V50L73 36L50 22Z"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="2"
          fill="hsl(var(--primary)/0.1)"
          variants={draw(0.5, 2)}
        />
         <motion.path
          d="M50 50L73 64L50 78V50Z"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="2"
          fill="hsl(var(--primary)/0.2)"
          variants={draw(0.8, 2)}
        />
         <motion.path
          d="M50 50L27 64L50 78V50Z"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="2"
          fill="hsl(var(--primary)/0.3)"
          variants={draw(1.1, 2)}
        />
        <motion.path
          d="M50 22L27 36L50 50V22Z"
          stroke="currentColor"
          strokeOpacity="0.7"
          strokeWidth="2"
          fill="hsl(var(--primary)/0.4)"
          variants={draw(1.4, 2)}
        />
      </motion.svg>
    </div>
  );
}
