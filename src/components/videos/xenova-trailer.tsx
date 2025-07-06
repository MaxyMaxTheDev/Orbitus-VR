
'use client';

import { motion } from 'framer-motion';
import { XenovaVRLogo } from '../icons/logo';

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
      <motion.div
        animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <XenovaVRLogo className="w-48 h-48 text-primary" />
      </motion.div>
    </div>
  );
}
