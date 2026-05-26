"use client";

import { useEffect, useState } from "react";

export type TimeState = "day" | "dusk" | "night" | "dawn";

function getTimeState(date: Date): TimeState {
  const hour = parseInt(
    date.toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    })
  );

  // Dawn  06:00–09:00
  // Day   09:00–17:00
  // Dusk  17:00–20:00
  // Night 20:00–06:00
  if (hour >= 6 && hour < 9)  return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
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
  const [timeState, setTimeState] = useState<TimeState>(() => getTimeState(new Date()));
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTimeState(getTimeState(now));
      setFormattedTime(getFormattedTime(now));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { timeState, formattedTime };
}
