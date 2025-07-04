"use client";

import { useEffect, useState } from "react";

export function VirtualClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    const timerId = setInterval(updateClock, 1000 * 30); // Update every 30s is enough
    updateClock();

    return () => clearInterval(timerId);
  }, []);

  if (!time) {
    return (
      <div className="w-20 text-center">
        <p className="text-xl text-muted-foreground font-bold tabular-nums">--:--</p>
      </div>
    );
  }

  return (
    <div className="w-20 text-center">
      <p className="text-xl text-foreground font-bold tabular-nums">
        {time}
      </p>
    </div>
  );
}
