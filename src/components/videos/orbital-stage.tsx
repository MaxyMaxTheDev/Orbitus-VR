'use client';
import { motion } from 'framer-motion';

const bars = Array.from({ length: 15 });

export function OrbitalStage({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-end justify-center gap-2 pb-4">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-4 rounded-t-full bg-accent"
          style={{
            boxShadow: '0 0 5px hsl(var(--accent)), 0 0 10px hsl(var(--accent))',
          }}
          animate={{
            height: isPlaying ? ['10%', '80%', '10%'] : '10%',
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            repeatType: "mirror",
            ease: "circInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
