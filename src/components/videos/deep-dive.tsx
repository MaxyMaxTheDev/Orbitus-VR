
'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const bubbles = Array.from({ length: 20 });

export function DeepDive({ isPlaying }: { isPlaying: boolean }) {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // This runs only on the client, where `window` is available.
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-900 via-blue-950 to-black flex items-center justify-center overflow-hidden relative">
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-400/50"
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            left: `${Math.random() * 100}%`,
            bottom: '-25px'
          }}
          animate={{
            y: isPlaying ? [0, -windowHeight - 30] : 0,
            opacity: isPlaying ? [1, 0] : 0.5,
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
