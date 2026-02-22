"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TimeState = "day" | "dusk" | "night" | "dawn";

const states: TimeState[] = ["day", "dusk", "night", "dawn"];

function getTimeState(date: Date): TimeState {
  const hour = parseInt(
    date.toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    })
  );

  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 22) return "dusk";
  if (hour >= 22 || hour < 4) return "night";
  return "dawn";
}

function getFormattedTime(date: Date): string {
  const formatted = date.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return formatted.toLowerCase().replace(" ", "");
}

export function useTimeState() {
  const override = useRef<TimeState | null>(null);
  const [timeState, setTimeState] = useState<TimeState>(() => getTimeState(new Date()));
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      if (!override.current) setTimeState(getTimeState(now));
      setFormattedTime(getFormattedTime(now));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const cycleState = useCallback(() => {
    const current = override.current ?? timeState;
    const idx = states.indexOf(current);
    const next = states[(idx + 1) % states.length];
    override.current = next;
    setTimeState(next);
  }, [timeState]);

  return { timeState, formattedTime, cycleState };
}
