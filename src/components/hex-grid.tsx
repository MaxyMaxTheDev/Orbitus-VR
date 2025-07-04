
"use client";

import React from 'react';

export function HexGrid() {
  return (
    <div
      className="absolute inset-0 w-full h-full opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(60deg, transparent 48%, hsl(var(--primary) / 0.1) 48%, hsl(var(--primary) / 0.1) 52%, transparent 52%),
          linear-gradient(-60deg, transparent 48%, hsl(var(--primary) / 0.1) 48%, hsl(var(--primary) / 0.1) 52%, transparent 52%)
        `,
        backgroundSize: `
          50px 50px,
          50px 50px,
          100px 100px,
          100px 100px
        `,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,hsl(var(--primary)/0.15),transparent)]"></div>
    </div>
  );
}
