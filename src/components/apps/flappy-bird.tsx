
"use client";

import { cn } from "@/lib/utils";

export function FlappyBirdApp() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {/* 
        The game has a "phone size" aspect ratio. 
        We wrap it in a container that maintains a typical phone ratio (e.g., 9:16)
        while ensuring it doesn't stretch or distort.
      */}
      <div className="relative w-full max-w-[450px] aspect-[9/16] shadow-2xl shadow-accent/20">
        <iframe
          src="https://maxymaxthedev.github.io/bird_flappy/"
          className="w-full h-full border-0 rounded-xl"
          title="Flappy Bird"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
