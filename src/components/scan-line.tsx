
"use client";

export function ScanLine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[10%] bg-gradient-to-b from-accent/20 to-transparent animate-scanline"></div>
    </div>
  );
}
