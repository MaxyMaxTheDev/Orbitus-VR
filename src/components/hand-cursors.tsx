
"use client";

import { useEffect, useState, useRef } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HandCursors() {
  const [isClient, setIsClient] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    let animationFrameId: number;
    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.3);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.3);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(-50%, -50%) translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8"
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 w-full h-full rounded-full bg-primary/20 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </div>
    </div>
  );
}
