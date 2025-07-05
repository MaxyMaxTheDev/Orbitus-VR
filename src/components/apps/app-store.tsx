"use client";

import React from 'react';

// This component now directly renders the Minecraft game.
export function AppStore() {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src="https://mcraft.fun"
        frameBorder="0"
        className="w-full h-full"
        allowFullScreen
        title="Minecraft"
      ></iframe>
    </div>
  );
}
