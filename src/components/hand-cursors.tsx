"use client";

import { useEffect, useState } from "react";
import { Hand } from "lucide-react";

export function HandCursors() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Hand
        className="text-accent/70 w-8 h-8 fixed pointer-events-none transition-transform duration-75 ease-out z-50 drop-shadow-[0_0_8px_hsl(var(--accent))]"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-20%, -20%)`,
        }}
        strokeWidth={1.5}
      />
      <Hand
        className="text-accent/50 w-6 h-6 fixed pointer-events-none transition-transform duration-150 ease-out z-50 drop-shadow-[0_0_4px_hsl(var(--accent))]"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-90%, -90%) rotate(-20deg)`,
        }}
        strokeWidth={1}
      />
    </>
  );
}
