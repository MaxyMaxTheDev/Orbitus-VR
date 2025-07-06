'use client';
import { motion } from 'framer-motion';

const bubbles = Array.from({ length: 20 });

export function DeepDive({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0a192f] via-[#003366] to-black flex items-center justify-center overflow-hidden relative">
      {bubbles.map((_, i) => {
        const size = Math.random() * 20 + 5;
        const duration = Math.random() * 10 + 8;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-400/50"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${size}px`,
              boxShadow: '0 0 5px #67e8f9, 0 0 10px #67e8f9'
            }}
            animate={isPlaying ? {
              y: '-110vh',
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [1, 1, 0],
            } : {
              y: 0,
              x: 0,
              opacity: 0.5
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  );
}
