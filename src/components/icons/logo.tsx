import React from 'react';

export function XenovaVRLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 2.5L95.5 27.5V72.5L50 97.5L4.5 72.5V27.5L50 2.5Z"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path
        d="M50 22V50L73 36L50 22Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="4"
      />
       <path
        d="M50 50L73 64L50 78V50Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="4"
      />
       <path
        d="M50 50L27 64L50 78V50Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="4"
      />
      <path
        d="M50 22L27 36L50 50V22Z"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="4"
      />
    </svg>
  );
}
