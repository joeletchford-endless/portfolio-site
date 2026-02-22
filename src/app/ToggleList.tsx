"use client";

import { useState } from "react";

export default function ToggleList({
  items,
  defaultSelected,
  className,
}: {
  items: string[];
  defaultSelected?: number;
  className?: string;
}) {
  const [selected, setSelected] = useState<number | null>(defaultSelected ?? null);

  return (
    <ul className={`text-[16px] list-none p-0 no-circles ${className ?? ""}`}>
      {items.map((item, i) => (
        <li
          key={item}
          className="cursor-pointer pointer-events-auto flex items-center gap-1.5"
          onClick={() => setSelected(i)}
        >
          <span
            className="inline-block w-[10px] h-[10px] rounded-full border border-current shrink-0"
            style={selected === i ? { backgroundColor: "currentColor" } : undefined}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
