
'use client';

import { motion } from 'framer-motion';

export function CyberSamurai({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
      <motion.div
        className="w-4/5 h-2 rounded-full bg-destructive"
        style={{
          boxShadow: '0 0 10px #f00, 0 0 20px #f00, 0 0 40px #f00',
        }}
        animate={{
          scaleX: isPlaying ? [0.1, 1, 0.1] : 0.5,
          opacity: isPlaying ? [0, 1, 0] : 0.8,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="w-2 h-4/5 rounded-full bg-destructive absolute"
        style={{
          boxShadow: '0 0 10px #f00, 0 0 20px #f00, 0 0 40px #f00',
        }}
        animate={{
          scaleY: isPlaying ? [0.1, 1, 0.1] : 0.5,
          opacity: isPlaying ? [0, 1, 0] : 0.8,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.75,
        }}
      />
    </div>
  );
}
