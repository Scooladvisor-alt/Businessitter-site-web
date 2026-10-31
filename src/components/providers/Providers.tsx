"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <SmoothScroll />
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
