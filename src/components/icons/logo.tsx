import React from 'react';

export function XenovaVRLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Hexagon - Optimized for 24x24 React Icon standard */}
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      
      {/* Internal Isometric Lines forming the core structure */}
      <path d="M12 22V12" />
      <path d="M12 12L3 7" />
      <path d="M12 12l9-5" />
      
      {/* Central Node - Clean geometric accent */}
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
