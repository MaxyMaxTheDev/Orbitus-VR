"use client";

import { useEffect, useState } from "react";

export function VirtualClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };

    const timerId = setInterval(updateClock, 1000);
    updateClock();

    return () => clearInterval(timerId);
  }, []);

  if (!time) {
    return (
      <div className="fixed bottom-4 left-4 z-10">
        <p className="text-4xl font-mono text-accent/80 font-bold tabular-nums">--:--</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-10">
      <p className="text-4xl font-mono text-accent/80 font-bold tabular-nums">
        {time}
      </p>
    </div>
  );
}
