"use client";

import { useEffect, useRef, useState } from "react";
import RichmondClock from "./RichmondClock";
import ToggleList from "./ToggleList";
import { useTimeState, type TimeState } from "./useTimeState";
import content from "../../content.json";

const svgColors: Record<TimeState, { points: string; joints: string; dna: string; zag: string }> = {
  day:   { points: "#38BDF8", joints: "#38BDF8", dna: "#38BDF8", zag: "#38BDF8" },
  dusk:  { points: "#FDA4AF", joints: "#FDA4AF", dna: "#FDA4AF", zag: "#FDA4AF" },
  dawn:  { points: "#EA580C", joints: "#EA580C", dna: "#EA580C", zag: "#EA580C" },
  night: { points: "#1E293B", joints: "#1E293B", dna: "#1E293B", zag: "#1E293B" },
};

const bgColors: Record<TimeState, string> = {
  day: "",
  dusk: "#BE123C",
  dawn: "#431407",
  night: "#020617",
};

const textColors: Record<TimeState, string> = {
  day: "",
  dusk: "white",
  dawn: "white",
  night: "white",
};

export default function Home() {
  const { timeState, formattedTime, cycleState } = useTimeState();
  const [displayState, setDisplayState] = useState<TimeState>(timeState);
  const [allHidden, setAllHidden] = useState(false);
  const prevState = useRef(timeState);

  // Set initial body styles on mount
  useEffect(() => {
    document.body.style.backgroundColor = bgColors[timeState];
    document.body.style.color = textColors[timeState];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeState === prevState.current) return;
    prevState.current = timeState;

    // Phase 1: fade SVG out
    setAllHidden(true);

    // Phase 2: after fade-out, transition bg/text colors
    const t1 = setTimeout(() => {
      document.body.style.backgroundColor = bgColors[timeState];
      document.body.style.color = textColors[timeState];
      setDisplayState(timeState);
    }, 700);

    // Phase 3: after bg/text transition, fade new SVG in
    const t2 = setTimeout(() => {
      setAllHidden(false);
    }, 1400);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [timeState]);

  const colors = svgColors[displayState];

  return (
    <>
      <div className="relative w-full">
        {/* Invisible img for layout sizing */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/points.svg"
          alt=""
          className="block w-full h-auto invisible"
        />

        {/* Points layer */}
        <div
          className={`svg-mask absolute inset-0 w-full h-full${!allHidden && displayState === "day" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/points.svg)", WebkitMaskImage: "url(/points.svg)", backgroundColor: colors.points }}
        />

        {/* Joints layer */}
        <div
          className={`svg-mask absolute inset-0 w-full h-full${!allHidden && displayState === "day" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/joints.svg)", WebkitMaskImage: "url(/joints.svg)", backgroundColor: colors.joints }}
        />

        {/* DNA layer (dusk + dawn) */}
        <div
          className={`svg-mask-contain absolute inset-0 w-full h-full${!allHidden && (displayState === "dusk" || displayState === "dawn") ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/dna.svg)", WebkitMaskImage: "url(/dna.svg)", backgroundColor: colors.dna }}
        />

        {/* Zag layer (night) */}
        <div
          className={`svg-mask-contain absolute inset-0 w-full h-full${!allHidden && displayState === "night" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/zag.svg)", WebkitMaskImage: "url(/zag.svg)", backgroundColor: colors.zag }}
        />

        <RichmondClock formattedTime={formattedTime} onCycle={cycleState} />

        <div className="absolute inset-0 grid grid-cols-10 w-full content-start pointer-events-none">
          <p className="col-span-3 text-left text-[16px]">
            Joe Letchford is a visual designer with 9 years experience specializing
            in creating visually stunning interactive and print solutions for clients
            across art, tech, and education.
          </p>

          <div className="col-span-2" />

          <ToggleList items={["List", "Grid", "Organic"]} defaultSelected={2} className="col-span-1" />
          <ToggleList items={["Large", "Medium", "Small"]} defaultSelected={0} className="col-span-1" />
          <ToggleList items={["Animation", "Video", "Imagery"]} defaultSelected={1} className="col-span-1" />
          <ToggleList items={["Alt text", "Outlines", "Contrast"]} defaultSelected={2} className="col-span-1" />

          <ul className="col-span-1 text-[16px] list-none p-0 no-circles">
            <li className="pointer-events-auto cursor-pointer">− Font 100% +</li>
          </ul>

          <div className="col-span-10 h-8" />

          <ul className="col-span-3 text-[16px] list-none p-0 no-circles">
            <li>Shopify. 25—Now</li>
            <li>Dispatches. 21—Now</li>
            <li>Freelance. 22—25</li>
            <li>VCU Adjunct. 22—24</li>
            <li>Robinhood. 21—22</li>
            <li>Dropbox. 19—21</li>
            <li>Google. 18—19</li>
          </ul>
        </div>
      </div>

      {/* Projects */}
      {content.projects.map((project) => (
        <section key={project.slug} className="mt-16">
          <div className="grid grid-cols-12 gap-[12px] mb-4 text-[16px]">
            <h2 className="col-span-4">{project.title}</h2>
            <span className="col-span-4 opacity-60">Project Category</span>
            <span className="col-span-2 opacity-60">20XX</span>
            <span className="col-span-2 text-right">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  View →
                </a>
              ) : null}
            </span>
          </div>
          <div className="grid grid-cols-12 gap-[12px]">
            {project.images.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="col-span-2 w-full h-auto"
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
