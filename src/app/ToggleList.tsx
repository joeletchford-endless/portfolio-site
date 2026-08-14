"use client";

import { useState } from "react";

export default function ToggleList({
  items,
  defaultSelected,
  value,
  onChange,
  allowDeselect = false,
  disabled = false,
  className,
}: {
  items: string[];
  defaultSelected?: number;
  value?: number | null;
  onChange?: (index: number | null) => void;
  allowDeselect?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [internal, setInternal] = useState<number | null>(defaultSelected ?? null);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  function handleClick(i: number) {
    if (disabled) return;
    const next = allowDeselect && selected === i ? null : i;
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternal(next);
      onChange?.(next);
    }
  }

  return (
    <ul
      role="radiogroup"
      aria-disabled={disabled}
      className={`text-base list-none p-0 no-circles ${disabled ? "opacity-30 pointer-events-none" : ""} ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <li
          key={item}
          role="radio"
          aria-checked={selected === i}
          tabIndex={disabled ? -1 : 0}
          className="cursor-pointer pointer-events-auto flex items-center gap-1.5 active:scale-95 transition-transform duration-100"
          onClick={() => handleClick(i)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(i); } }}
        >
          <span
            className="inline-block w-[10px] h-[10px] rounded-full border border-current shrink-0 transition-[background-color] duration-150"
            style={selected === i ? { backgroundColor: "currentColor" } : undefined}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
