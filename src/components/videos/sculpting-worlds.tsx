'use client';
import { motion } from 'framer-motion';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.2, type: "tween", duration: 0.5, ease: "easeInOut" },
      opacity: { delay: i * 0.2, duration: 0.01 }
    }
  })
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
      repeat: Infinity,
      repeatDelay: 2
    }
  }
};

export function SculptingWorlds({ isPlaying }: { isPlaying: boolean }) {
  const points = [
    [50, 50], [150, 50], [150, 150], [50, 150],
    [80, 20], [180, 20], [180, 120], [80, 120]
  ];

  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Back face
    [4, 5], [5, 6], [6, 7], [7, 4], // Front face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting lines
  ];

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        initial="hidden"
        animate={isPlaying ? "visible" : "hidden"}
        variants={container}
      >
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={points[line[0]][0]}
            y1={points[line[0]][1]}
            x2={points[line[1]][0]}
            y2={points[line[1]][1]}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            variants={draw}
            custom={i}
          />
        ))}
      </motion.svg>
    </div>
  );
}
