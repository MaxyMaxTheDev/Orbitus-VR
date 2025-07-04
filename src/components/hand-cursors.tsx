"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HandCursors() {
  const [isClient, setIsClient] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const trailerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    let animationFrameId: number;
    const animate = () => {
      // Animate main cursor
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.2);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.2);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }

      // Animate trailer
      trailerPos.current.x = lerp(trailerPos.current.x, targetPos.current.x, 0.1);
      trailerPos.current.y = lerp(trailerPos.current.y, targetPos.current.y, 0.1);
      if (trailerRef.current) {
        trailerRef.current.style.transform = `translate(${trailerPos.current.x}px, ${trailerPos.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div
        ref={trailerRef}
        className="fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full bg-accent opacity-50"
        style={{ filter: 'blur(2px)' }}
      />
      <div
        ref={cursorRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-150",
          isClicking ? "scale-125" : "scale-100"
        )}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <circle cx="20" cy="20" r="2" fill="currentColor" className={cn("transition-all", isClicking && "fill-primary")}/>
          <path
            d="M20 4V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 36V32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M36 20H32"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 20H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
           <circle
            cx="20"
            cy="20"
            r="10"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity={isClicking ? 0.8 : 0.5}
            className="transition-all"
          />
           <circle
            cx="20"
            cy="20"
            r="14"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.2"
            className="transition-all"
            strokeDasharray={isClicking ? "0" : "4"}
           />
        </svg>
      </div>
    </>
  );
}
