import React from 'react';

// Outer Hexagon Shell
const SHELL = 'M12 2l9 5v10l-9 5-9-5V7l9-5z';
// Internal Hourglass Structure
const HOURGLASS = 'M8 8h8L8 16h8';
const NUCLEUS = 'M8 8l8 8';

const PATHS = [SHELL, HOURGLASS, NUCLEUS];

type OrbitusVRLogoProps = {
  className?: string;
  /** Sketch the strokes on instead of showing them finished. Boot screen only. */
  draw?: boolean;
  /** Seconds for the full sequence, shell first. */
  duration?: number;
};

export function OrbitusVRLogo({ className, draw = false, duration = 1.3 }: OrbitusVRLogoProps) {
  // Each stroke is revealed in turn, so the mark reads as being sketched
  // rather than simply faded in.
  const strokeMs = Math.round((duration * 0.55) * 1000);

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
      {PATHS.map((d, index) => {
        if (!draw) {
          return <path key={d} d={d} />;
        }

        return (
          <path
            key={d}
            d={d}
            pathLength={1}
            className="orbitus-draw"
            style={
              {
                '--orbitus-draw-duration': `${strokeMs}ms`,
                '--orbitus-draw-delay': `${index * Math.round(duration * 250)}ms`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}
