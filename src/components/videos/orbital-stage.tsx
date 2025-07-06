
'use client';
import { motion } from 'framer-motion';

const bars = Array.from({ length: 15 });

export function OrbitalStage({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center gap-2">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-4 rounded-full bg-accent"
          animate={{
            height: isPlaying ? ['10%', '80%', '10%'] : '10%',
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
