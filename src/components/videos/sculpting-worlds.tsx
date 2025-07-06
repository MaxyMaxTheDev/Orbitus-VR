
'use client';
import { motion } from 'framer-motion';

export function SculptingWorlds({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center" style={{ perspective: '800px' }}>
      <motion.div
        className="w-32 h-32 bg-transparent border-2 border-primary"
        animate={{
          rotateX: isPlaying ? [0, 360] : 45,
          rotateY: isPlaying ? [0, 360] : 45,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'translateZ(64px)' }} />
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'translateZ(-64px)' }} />
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'rotateY(90deg) translateZ(64px)' }} />
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'rotateY(90deg) translateZ(-64px)' }} />
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'rotateX(90deg) translateZ(64px)' }} />
        <div className="absolute w-full h-full border border-primary/50" style={{ transform: 'rotateX(90deg) translateZ(-64px)' }} />
      </motion.div>
    </div>
  );
}
