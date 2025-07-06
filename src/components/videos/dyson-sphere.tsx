'use client';
import { motion } from 'framer-motion';

const rings = Array.from({ length: 5 });

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
}

const ringVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

export function DysonSphere({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div 
        className="relative w-48 h-48"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(75deg)' }}
        initial="hidden"
        animate={isPlaying ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-300"
            style={{ boxShadow: '0 0 20px #ff0, 0 0 40px #ff0' }}
            animate={isPlaying ? { 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
            } : { scale: 1, opacity: 1}}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
        {rings.map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-primary/50"
            style={{
              transform: `scale(${1 + i * 0.4})`,
            }}
            variants={ringVariants}
            animate={{
              rotateZ: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 5 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
