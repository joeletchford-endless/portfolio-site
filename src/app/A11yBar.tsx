"use client";

export type ContrastMode = "default" | "greyscale" | "high" | "inverted";

interface A11yBarProps {
  textScale: number;
  onTextScale: (v: number) => void;
  contrastMode: ContrastMode;
  onContrastMode: (v: ContrastMode) => void;
  motionReduced: boolean;
  onMotionReduced: (v: boolean) => void;
  altTextOn: boolean;
  onAltTextOn: (v: boolean) => void;
  outlinesOn: boolean;
  onOutlinesOn: (v: boolean) => void;
}

const CONTRAST_OPTIONS: { value: ContrastMode; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "greyscale", label: "Greyscale" },
  { value: "high", label: "High" },
  { value: "inverted", label: "Inverted" },
];

function Circle({ active }: { active: boolean }) {
  return (
    <span
      className="inline-block w-[10px] h-[10px] rounded-full border border-current shrink-0"
      style={active ? { backgroundColor: "currentColor" } : undefined}
    />
  );
}

export default function A11yBar({
  textScale,
  onTextScale,
  contrastMode,
  onContrastMode,
  motionReduced,
  onMotionReduced,
  altTextOn,
  onAltTextOn,
  outlinesOn,
  onOutlinesOn,
}: A11yBarProps) {
  const scalePercent = Math.round(textScale * 100);

  return (
    <nav
      aria-label="Accessibility controls"
      className="sticky top-0 z-50 flex flex-wrap items-start gap-x-8 gap-y-1 text-base list-none py-[25px]"
      style={{
        backgroundColor: "var(--page-bg, white)",
        transition: "background-color 700ms ease-in",
      }}
    >
      {/* Text size */}
      <div className="flex items-center gap-1.5" role="group" aria-label="Text size">
        <button
          className="cursor-pointer"
          aria-label="Decrease text size"
          onClick={() => onTextScale(parseFloat(Math.max(0.8, textScale - 0.1).toFixed(2)))}
        >
          −
        </button>
        <span>Text {scalePercent}%</span>
        <button
          className="cursor-pointer"
          aria-label="Increase text size"
          onClick={() => onTextScale(parseFloat(Math.min(1.6, textScale + 0.1).toFixed(2)))}
        >
          +
        </button>
      </div>

      {/* Contrast */}
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Contrast mode">
        {CONTRAST_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            role="radio"
            aria-checked={contrastMode === value}
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => onContrastMode(value)}
          >
            <Circle active={contrastMode === value} />
            {label}
          </button>
        ))}
      </div>

      {/* Motion */}
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Motion preference">
        {(["On", "Reduced"] as const).map((label) => {
          const active = label === "Reduced" ? motionReduced : !motionReduced;
          return (
            <button
              key={label}
              role="radio"
              aria-checked={active}
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => onMotionReduced(label === "Reduced")}
            >
              <Circle active={active} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Alt text */}
      <button
        aria-pressed={altTextOn}
        className="flex items-center gap-1.5 cursor-pointer"
        onClick={() => onAltTextOn(!altTextOn)}
      >
        <Circle active={altTextOn} />
        Alt text
      </button>

      {/* Outlines */}
      <button
        aria-pressed={outlinesOn}
        className="flex items-center gap-1.5 cursor-pointer"
        onClick={() => onOutlinesOn(!outlinesOn)}
      >
        <Circle active={outlinesOn} />
        Outlines
      </button>
    </nav>
  );
}
