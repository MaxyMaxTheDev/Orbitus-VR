import React from 'react';

export function XenovaVRLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Hexagon */}
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      
      {/* Internal Isometric Lines */}
      <path d="M12 22V12" />
      <path d="M12 12L3 7" />
      <path d="M12 12l9-5" />
      
      {/* Decorative Core Accent */}
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}
