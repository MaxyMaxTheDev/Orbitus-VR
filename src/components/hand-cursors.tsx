"use client";

import { useEffect, useState } from "react";
import { Hand } from "lucide-react";
import { cn } from "@/lib/utils";

export function HandCursors() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Hand
        className={cn(
          "text-accent w-8 h-8 fixed pointer-events-none transition-transform duration-75 ease-out z-50 drop-shadow-[0_0_8px_hsl(var(--accent))]",
          isClicking && "scale-90"
          )}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-20%, -20%)`,
        }}
        strokeWidth={1.5}
      />
      <div 
        className="w-10 h-10 fixed pointer-events-none transition-all duration-300 ease-out z-40 rounded-full"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
          background: isClicking ? 'hsla(var(--accent), 0.3)' : 'hsla(var(--accent), 0)',
          scale: isClicking ? 1 : 0,
        }}
      />
    </>
  );
}
