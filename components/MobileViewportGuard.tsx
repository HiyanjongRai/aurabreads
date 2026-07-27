"use client";

import { useEffect } from "react";

const FORM_SELECTOR = "input, textarea, select, [contenteditable='true']";

export function MobileViewportGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const visualViewport = window.visualViewport;
    let focusTimer: number | undefined;

    const syncViewport = () => {
      const height = visualViewport?.height ?? window.innerHeight;
      root.style.setProperty("--ab-visual-viewport-height", `${height}px`);
      root.toggleAttribute(
        "data-keyboard-open",
        Boolean(visualViewport && height < window.innerHeight - 80),
      );
    };

    const keepFocusedControlVisible = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.matches(FORM_SELECTOR)) return;
      if (!window.matchMedia("(max-width: 768px)").matches) return;

      window.clearTimeout(focusTimer);
      focusTimer = window.setTimeout(() => {
        target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }, 260);
    };

    syncViewport();
    visualViewport?.addEventListener("resize", syncViewport);
    visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("resize", syncViewport);
    document.addEventListener("focusin", keepFocusedControlVisible);

    return () => {
      window.clearTimeout(focusTimer);
      visualViewport?.removeEventListener("resize", syncViewport);
      visualViewport?.removeEventListener("scroll", syncViewport);
      window.removeEventListener("resize", syncViewport);
      document.removeEventListener("focusin", keepFocusedControlVisible);
      root.removeAttribute("data-keyboard-open");
      root.style.removeProperty("--ab-visual-viewport-height");
    };
  }, []);

  return null;
}
