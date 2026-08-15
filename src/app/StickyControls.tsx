"use client";

import { useEffect, useState } from "react";
import ToggleList from "./ToggleList";
import { type ContrastMode } from "./A11yBar";

const CONTRAST_MODES: ContrastMode[] = ["default", "greyscale", "high", "inverted"];

export default function StickyControls({
  textScale,
  setTextScale,
  contrastMode,
  setContrastMode,
  altTextOn,
  setAltTextOn,
  outlinesOn,
  setOutlinesOn,
  motionReduced,
  setMotionReduced,
  layoutMode,
  setLayoutMode,
  sizeMode,
  setSizeMode,
}: {
  textScale: number;
  setTextScale: (v: number) => void;
  contrastMode: ContrastMode;
  setContrastMode: (v: ContrastMode) => void;
  altTextOn: boolean;
  setAltTextOn: (v: boolean) => void;
  outlinesOn: boolean;
  setOutlinesOn: (v: boolean) => void;
  motionReduced: boolean;
  setMotionReduced: (v: boolean) => void;
  layoutMode: number;
  setLayoutMode: (v: number) => void;
  sizeMode: number;
  setSizeMode: (v: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 260);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="hidden lg:grid fixed top-0 left-0 right-0 z-[100] grid-cols-10 w-full px-[25px] py-[25px] text-base"
      style={{
        backgroundColor: "var(--page-bg, white)",
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 240ms ease-out, background-color 700ms ease-in",
      }}
    >
      <div className="col-span-3" />
      <div className="col-span-2" />

      <ul className="col-span-1 list-none p-0 no-circles pointer-events-auto">
        <li className="flex items-center gap-1 cursor-pointer">
          <button className="active:scale-90 transition-transform duration-100" aria-label="Decrease text size" onClick={() => setTextScale(parseFloat(Math.max(0.8, textScale - 0.1).toFixed(2)))}>−</button>
          <span>{Math.round(textScale * 100)}%</span>
          <button className="active:scale-90 transition-transform duration-100" aria-label="Increase text size" onClick={() => setTextScale(parseFloat(Math.min(1.6, textScale + 0.1).toFixed(2)))}>+</button>
        </li>
      </ul>

      <ToggleList
        items={["Default", "Greyscale", "High", "Inverted"]}
        value={CONTRAST_MODES.indexOf(contrastMode)}
        onChange={(i) => { if (i !== null) setContrastMode(CONTRAST_MODES[i]); }}
        className="col-span-1"
      />
      <div className="col-span-1 flex flex-col">
        <ToggleList items={["Alt text"]} value={altTextOn ? 0 : null} onChange={(i) => setAltTextOn(i === 0)} allowDeselect />
        <ToggleList items={["Outlines"]} value={outlinesOn ? 0 : null} onChange={(i) => setOutlinesOn(i === 0)} allowDeselect />
        <ToggleList items={["Reduce motion"]} value={motionReduced ? 0 : null} onChange={(i) => setMotionReduced(i === 0)} allowDeselect />
      </div>
      <ToggleList
        items={["List", "Grid"]}
        value={layoutMode}
        onChange={(i) => { if (i !== null) setLayoutMode(i); }}
        className="col-span-1"
      />
      <ToggleList
        items={["Large", "Medium", "Small"]}
        value={sizeMode}
        onChange={(i) => { if (i !== null) setSizeMode(i); }}
        disabled={layoutMode === 0}
        className="col-span-1"
      />
    </div>
  );
}
