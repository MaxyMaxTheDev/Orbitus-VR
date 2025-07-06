
'use client';
import { motion } from 'framer-motion';

const rings = Array.from({ length: 5 });

export function DysonSphere({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center" style={{ perspective: '1000px' }}>
      <div className="relative w-48 h-48" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(75deg)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-yellow-300"
             style={{ boxShadow: '0 0 20px #ff0, 0 0 40px #ff0' }}/>
        {rings.map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-primary/50"
            style={{
              transform: `scale(${1 + i * 0.4})`,
            }}
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
      </div>
    </div>
  );
}
