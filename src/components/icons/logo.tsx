import React from 'react';

export function NexusVRLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 14.5c0 3.5 2.5 5.5 5 5.5s5-2 5-5.5V12" />
      <path d="M12 9.5V2" />
      <path d="M15.5 12c0-3-1.5-5-3.5-5s-3.5 2-3.5 5" />
      <path d="M2 12h5m10 0h5" />
    </svg>
  );
}
