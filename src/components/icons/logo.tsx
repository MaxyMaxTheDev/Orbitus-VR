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
      {/* Standardized 2D Hexagon Shell - React Icon Style */}
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
    </svg>
  );
}
