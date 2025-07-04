"use client";

import { useEffect, useState } from "react";

export function VirtualClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };

    const timerId = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(timerId);
  }, []);

  if (!time) {
    return (
      <div className="fixed bottom-4 left-4 z-10 font-headline tracking-widest">
        <p className="text-4xl text-accent/80 font-bold tabular-nums drop-shadow-[0_0_10px_hsl(var(--accent))]">--:--:--</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-10 font-headline tracking-widest">
      <p className="text-4xl text-accent font-bold tabular-nums drop-shadow-[0_0_10px_hsl(var(--accent))]">
        {time}
      </p>
    </div>
  );
}
