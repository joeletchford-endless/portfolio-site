"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

type ElementData = {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
};

const ORANGE = "rgba(255,160,0,0.35)";
const GREEN = "rgba(100,200,100,0.35)";
const LABEL_BG = "#1a1a2e";
const LABEL_FG = "#7ecfff";
const LABEL_BORDER = "#4d9de0";

function collectElements(): ElementData[] {
  const targets = document.querySelectorAll<HTMLElement>(
    "img, section, h2"
  );
  const result: ElementData[] = [];
  let idx = 0;
  targets.forEach((el) => {
    if (el.closest("[data-dev-overlay]")) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cs = getComputedStyle(el);
    result.push({
      id: `dev-${idx++}`,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      marginTop: parseFloat(cs.marginTop) || 0,
      marginRight: parseFloat(cs.marginRight) || 0,
      marginBottom: parseFloat(cs.marginBottom) || 0,
      marginLeft: parseFloat(cs.marginLeft) || 0,
      paddingTop: parseFloat(cs.paddingTop) || 0,
      paddingRight: parseFloat(cs.paddingRight) || 0,
      paddingBottom: parseFloat(cs.paddingBottom) || 0,
      paddingLeft: parseFloat(cs.paddingLeft) || 0,
    });
  });
  return result;
}

export default function DevOutlineOverlay({ trigger }: { trigger?: unknown }) {
  const [els, setEls] = useState<ElementData[]>([]);
  const rafRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setEls(collectElements());
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    measure();
  }, [measure, trigger]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  return (
    <div
      data-dev-overlay=""
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
        overflow: "hidden",
      }}
    >
      {els.map(({ id, top, left, right, bottom, width, height, marginTop, marginRight, marginBottom, marginLeft, paddingTop, paddingRight, paddingBottom, paddingLeft }) => (
        <Fragment key={id}>
          {/* Margin strips — orange */}
          {marginTop > 0 && (
            <div style={{ position: "fixed", top: top - marginTop, left: left - marginLeft, width: width + marginLeft + marginRight, height: marginTop, background: ORANGE }} />
          )}
          {marginBottom > 0 && (
            <div style={{ position: "fixed", top: bottom, left: left - marginLeft, width: width + marginLeft + marginRight, height: marginBottom, background: ORANGE }} />
          )}
          {marginLeft > 0 && (
            <div style={{ position: "fixed", top, left: left - marginLeft, width: marginLeft, height, background: ORANGE }} />
          )}
          {marginRight > 0 && (
            <div style={{ position: "fixed", top, left: right, width: marginRight, height, background: ORANGE }} />
          )}
          {/* Padding strips — green */}
          {paddingTop > 0 && (
            <div style={{ position: "fixed", top, left, width, height: paddingTop, background: GREEN }} />
          )}
          {paddingBottom > 0 && (
            <div style={{ position: "fixed", top: bottom - paddingBottom, left, width, height: paddingBottom, background: GREEN }} />
          )}
          {paddingLeft > 0 && (
            <div style={{ position: "fixed", top: top + paddingTop, left, width: paddingLeft, height: height - paddingTop - paddingBottom, background: GREEN }} />
          )}
          {paddingRight > 0 && (
            <div style={{ position: "fixed", top: top + paddingTop, left: right - paddingRight, width: paddingRight, height: height - paddingTop - paddingBottom, background: GREEN }} />
          )}
          {/* Dimension label */}
          <div
            style={{
              position: "fixed",
              top,
              left,
              background: LABEL_BG,
              color: LABEL_FG,
              fontFamily: "monospace",
              fontSize: "10px",
              padding: "1px 4px",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              border: `1px solid ${LABEL_BORDER}`,
              borderRadius: "2px",
            }}
          >
            {Math.round(width)}×{Math.round(height)}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
