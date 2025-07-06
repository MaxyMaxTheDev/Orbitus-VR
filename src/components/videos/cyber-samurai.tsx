'use client';
import { motion } from 'framer-motion';

const slash = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: [0, 1, 1, 0],
        transition: {
            pathLength: { duration: 0.2, ease: "easeOut" },
            opacity: { duration: 0.8, times: [0, 0.2, 0.9, 1] }
        }
    }
}

const container = {
    hidden: {},
    visible: {
        transition: {
            repeat: Infinity,
            repeatDelay: 1,
            staggerChildren: 0.3
        }
    }
}

export function CyberSamurai({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        initial="hidden"
        animate={isPlaying ? "visible" : "hidden"}
        variants={container}
      >
        <motion.path
            d="M 20 180 C 80 120, 120 80, 180 20"
            stroke="#ff0000"
            strokeWidth="4"
            fill="none"
            variants={slash}
            style={{ filter: "drop-shadow(0 0 5px #f00)"}}
        />
         <motion.path
            d="M 180 180 C 120 120, 80 80, 20 20"
            stroke="#ff0000"
            strokeWidth="4"
            fill="none"
            variants={slash}
            style={{ filter: "drop-shadow(0 0 5px #f00)"}}
        />
      </motion.svg>
    </div>
  );
}
