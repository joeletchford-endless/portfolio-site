"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type ContrastMode } from "../A11yBar";
import DevOutlineOverlay from "../DevOutlineOverlay";
import Lightbox from "../Lightbox";
import RichmondClock from "../RichmondClock";
import ToggleList from "../ToggleList";
import { useTimeState, type TimeState } from "../useTimeState";

type Project = {
  title: string;
  slug: string;
  url: string | null;
  images: string[];
};

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

const CONTRAST_MODES: ContrastMode[] = ["default", "greyscale", "high", "inverted"];

const gridColsClass: Record<number, string> = {
  0: "grid-cols-1 sm:grid-cols-2",
  1: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  2: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-8",
};

export default function HomeClient({ projects, employment }: { projects: Project[]; employment: string[] }) {
  const { timeState, formattedTime } = useTimeState();
  const [displayState, setDisplayState] = useState<TimeState>(timeState);
  const [allHidden, setAllHidden] = useState(false);
  const prevState = useRef(timeState);
  const hasMounted = useRef(false);

  const [layoutMode, setLayoutMode] = useState(1);
  const [sizeMode, setSizeMode] = useState(2);

  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const openLightbox = useCallback((images: string[], index: number) => setLightbox({ images, index }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(() => setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.images.length }), []);
  const prevImage = useCallback(() => setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }), []);

  const [textScale, setTextScale] = useState(1);
  const [contrastMode, setContrastMode] = useState<ContrastMode>("default");
  const [motionReduced, setMotionReduced] = useState(false);
  const [altTextOn, setAltTextOn] = useState(false);
  const [outlinesOn, setOutlinesOn] = useState(false);
  const [a11yInit, setA11yInit] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("a11y");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.textScale != null) setTextScale(p.textScale);
        if (p.contrastMode != null) setContrastMode(p.contrastMode);
        if (p.motionReduced != null) setMotionReduced(p.motionReduced);
        if (p.altTextOn != null) setAltTextOn(p.altTextOn);
        if (p.outlinesOn != null) setOutlinesOn(p.outlinesOn);
      } catch {}
    } else {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMotionReduced(true);
      }
      if (window.matchMedia("(prefers-contrast: more)").matches) {
        setContrastMode("high");
      }
    }
    setA11yInit(true);
  }, []);

  useEffect(() => {
    if (!a11yInit) return;
    localStorage.setItem("a11y", JSON.stringify({ textScale, contrastMode, motionReduced, altTextOn, outlinesOn }));
  }, [a11yInit, textScale, contrastMode, motionReduced, altTextOn, outlinesOn]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(textScale));
  }, [textScale]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("high-contrast", contrastMode === "high");
    document.body.classList.toggle("greyscale-images", contrastMode === "greyscale");
    document.body.classList.toggle("contrast-inverted", contrastMode === "inverted");
    return () => {
      document.body.classList.remove("greyscale-images", "contrast-inverted");
    };
  }, [contrastMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", motionReduced);
  }, [motionReduced]);

  useEffect(() => {
    setContrastMode(timeState !== "day" ? "greyscale" : "default");
  }, [timeState]);

  useEffect(() => {
    if (!hasMounted.current) {
      // Correct any stale initial state (e.g. from a prerendered snapshot) without animating.
      hasMounted.current = true;
      prevState.current = timeState;
      setDisplayState(timeState);
      document.body.style.backgroundColor = bgColors[timeState];
      document.body.style.color = textColors[timeState];
      document.documentElement.style.setProperty("--page-bg", bgColors[timeState] || "white");
      return;
    }

    if (timeState === prevState.current) return;
    prevState.current = timeState;

    setAllHidden(true);

    const t1 = setTimeout(() => {
      document.body.style.backgroundColor = bgColors[timeState];
      document.body.style.color = textColors[timeState];
      document.documentElement.style.setProperty("--page-bg", bgColors[timeState] || "white");
      setDisplayState(timeState);
    }, 700);

    const t2 = setTimeout(() => {
      setAllHidden(false);
    }, 1400);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [timeState]);

  const colors = svgColors[displayState];
  const imageGridCols = gridColsClass[sizeMode] ?? "grid-cols-4";

  return (
    <div className={outlinesOn ? "dev-outline" : undefined}>
      <h1 className="sr-only">Joe Letchford — Art Director &amp; Visual Designer</h1>
      {outlinesOn && (
        <DevOutlineOverlay trigger={`${layoutMode}-${sizeMode}`} />
      )}

      {/* ── Mobile / tablet bio (above hero, hidden on desktop) ── */}
      <p className="lg:hidden text-base mb-4">
        Joe Letchford is a visual designer with 9 years experience specializing
        in creating visually stunning interactive and print solutions for clients
        across art, tech, and education.
      </p>

      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/points.svg"
          alt=""
          data-no-greyscale
          className="block w-full h-auto invisible max-h-[50vw] lg:max-h-none"
        />

        <div
          className={`svg-mask absolute inset-0 w-full h-full${!allHidden && displayState === "day" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/points.svg)", WebkitMaskImage: "url(/points.svg)", backgroundColor: colors.points }}
        />

        <div
          className={`svg-mask absolute inset-0 w-full h-full${!allHidden && displayState === "day" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/joints.svg)", WebkitMaskImage: "url(/joints.svg)", backgroundColor: colors.joints }}
        />

        <div
          className={`svg-mask-contain absolute inset-0 w-full h-full${!allHidden && (displayState === "dusk" || displayState === "dawn") ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/dna.svg)", WebkitMaskImage: "url(/dna.svg)", backgroundColor: colors.dna }}
        />

        <div
          className={`svg-mask-contain absolute inset-0 w-full h-full${!allHidden && displayState === "night" ? "" : " opacity-0"}`}
          style={{ maskImage: "url(/zag.svg)", WebkitMaskImage: "url(/zag.svg)", backgroundColor: colors.zag }}
        />

        <RichmondClock formattedTime={formattedTime} />

        {/* ── Desktop-only overlay (lg+) ── */}
        <div className="hidden lg:grid absolute inset-0 grid-cols-10 w-full content-start pointer-events-none">
          <p className="col-span-3 text-base text-left">
            Joe Letchford is a visual designer with 9 years experience specializing
            in creating visually stunning interactive and print solutions for clients
            across art, tech, and education.
          </p>

          <div className="col-span-2" />

          <ul className="col-span-1 text-base list-none p-0 no-circles pointer-events-auto">
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

          <div className="col-span-10 h-8" />

          <ul className="col-span-3 text-base list-none p-0 no-circles">
            {employment.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      </div>

      {/* ── Mobile / tablet controls + employment (below hero, hidden on desktop) ── */}
      <div className="lg:hidden mt-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6 text-base pointer-events-auto">
          <ToggleList
            items={["List", "Grid"]}
            value={layoutMode}
            onChange={(i) => { if (i !== null) setLayoutMode(i); }}
          />
          <ToggleList
            items={["Large", "Medium", "Small"]}
            value={sizeMode}
            onChange={(i) => { if (i !== null) setSizeMode(i); }}
            disabled={layoutMode === 0}
          />
          <div className="flex flex-col">
            <ToggleList items={["Alt text"]} value={altTextOn ? 0 : null} onChange={(i) => setAltTextOn(i === 0)} allowDeselect />
            <ToggleList items={["Outlines"]} value={outlinesOn ? 0 : null} onChange={(i) => setOutlinesOn(i === 0)} allowDeselect />
            <ToggleList items={["Reduce motion"]} value={motionReduced ? 0 : null} onChange={(i) => setMotionReduced(i === 0)} allowDeselect />
          </div>
        </div>
        <ul className="text-base list-none p-0 no-circles">
          {employment.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </div>

      {/* Projects */}
      <main>
        {projects.map((project) => (
          <section key={project.slug} className="mt-8 lg:mt-16">
            <div className="grid grid-cols-12 gap-[12px] mb-4 text-base">
              <h2 className="col-span-8 lg:col-span-4">{project.title}</h2>
              <span className="hidden lg:block col-span-4 opacity-60">Project Category</span>
              <span className="hidden lg:block col-span-2 opacity-60">20XX</span>
              <span className="col-span-4 lg:col-span-2 text-right">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block opacity-60 hover:opacity-100 active:scale-95 transition-[opacity,transform] duration-100"
                  >
                    View →
                  </a>
                ) : null}
              </span>
            </div>

            {layoutMode === 0 ? (
              <div className="flex gap-[12px] overflow-x-auto">
                {project.images.map((src, idx) => (
                  <div
                    key={src}
                    className="cursor-pointer filmstrip-item"
                    onClick={() => openLightbox(project.images, idx)}
                  >
                    <div className="relative aspect-video overflow-hidden active:scale-[0.97] transition-transform duration-100">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 12vw"
                        className="object-cover"
                      />
                    </div>
                    {altTextOn && (
                      <div style={{ fontFamily: "monospace", fontSize: "0.6875rem", opacity: 0.5, marginTop: "3px" }}>
                        {src.split("/").pop()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${imageGridCols} gap-[12px]`}>
                {project.images.map((src, idx) => (
                  <div
                    key={src}
                    className="cursor-pointer"
                    onClick={() => openLightbox(project.images, idx)}
                  >
                    <div className="relative aspect-video overflow-hidden active:scale-[0.97] transition-transform duration-100">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                        className="object-cover"
                      />
                    </div>
                    {altTextOn && (
                      <div style={{ fontFamily: "monospace", fontSize: "0.6875rem", opacity: 0.5, marginTop: "3px" }}>
                        {src.split("/").pop()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}
