import React from 'react';

export function NovaVRLogo({ className }: { className?: string }) {
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
      {/* Outer Hexagon Shell */}
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      {/* Internal Hourglass Structure */}
      <path d="M8 8h8L8 16h8" />
      <path d="M8 8l8 8" />
    </svg>
  );
}
