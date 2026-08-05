"use client";

import { useEffect, useRef, useState, createElement, type ReactNode } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "header";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
  /** matches the original mockup's rv.delay-100 / delay-200 / delay-300 */
  delay?: "delay-100" | "delay-200" | "delay-300";
};

/**
 * Single source of truth for the "scroll reveal" behavior. The two Stitch
 * mockups each shipped a slightly different implementation (scroll-listener
 * vs IntersectionObserver, .active vs .visible) — this replaces both.
 */
export function Reveal({ children, className = "", as = "div", delay }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fast path: if the element is already on/near screen at mount (e.g. a
    // deep link straight into a section, a tall viewport, or a fast
    // programmatic scroll), don't wait on the async observer callback.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80 && rect.bottom > 0) {
      setActive(true);
      return;
    }

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -80px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    setActive(true);
  }, []);

  const classes = ["rv", delay, active ? "active" : "", className].filter(Boolean).join(" ");

  return createElement(as, { ref, className: classes }, children);
}
