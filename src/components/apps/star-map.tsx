"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, X } from 'lucide-react';

const starSystems = [
  { id: 'sol', name: 'Sol System', description: 'A well-charted G-type main-sequence star system. Birthplace of humanity. Heavily populated.', top: '50%', left: '50%' },
  { id: 'alpha-centauri', name: 'Alpha Centauri', description: 'A binary star system, the closest to Sol. A bustling hub of interstellar trade.', top: '55%', left: '45%' },
  { id: 'trappist-1', name: 'TRAPPIST-1', description: 'An ultra-cool dwarf star hosting seven terrestrial planets. Known for its exotic biotech.', top: '30%', left: '25%' },
  { id: 'kepler-186f', name: 'Kepler-186f', description: 'The first Earth-sized exoplanet discovered in the habitable zone of another star. A major agricultural center.', top: '75%', left: '80%' },
  { id: 'sirius', name: 'Sirius System', description: 'The brightest star in the night sky. Home to advanced energy research facilities.', top: '40%', left: '65%' },
  { id: 'vega', name: 'Vega System', description: 'A young, bright star surrounded by a massive dust disk. A popular destination for explorers and prospectors.', top: '20%', left: '85%' },
];

type StarSystem = typeof starSystems[0];

export function StarMap() {
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">
        <Image
            src="https://placehold.co/1920x1080.png"
            alt="Star Map"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
            data-ai-hint="star map galaxy"
        />

        {starSystems.map(system => (
            <div
                key={system.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ top: system.top, left: system.left }}
                onClick={() => setSelectedSystem(system)}
            >
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <div className="absolute w-8 h-8 rounded-full border border-accent/50 group-hover:scale-150 group-hover:border-accent transition-transform duration-300" />
                <span className="absolute left-full ml-2 text-foreground/70 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {system.name}
                </span>
            </div>
        ))}

        <AnimatePresence>
            {selectedSystem && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-4 left-4 right-4 md:left-auto md:max-w-sm p-4 bg-card/80 backdrop-blur-md border border-border rounded-lg shadow-2xl"
                >
                    <button onClick={() => setSelectedSystem(null)} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-6 h-6 text-accent"/>
                        <h3 className="text-xl font-bold text-foreground">{selectedSystem.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedSystem.description}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
