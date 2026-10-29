import React, { Profiler, useEffect, useRef } from 'react';
import { useFrameCallback, useSharedValue } from 'react-native-reanimated';

// Flip to false to silence the [perf] lines in Metro
const ENABLED = __DEV__;

interface PerfProbeProps {
  id: string;
  children: React.ReactNode;
}

/**
 * Logs once a second: JS fps, UI fps and React commits inside this subtree.
 * Dev-build numbers run slower than release: compare runs against each other, never against 60.
 */
function Probe({ id, children }: PerfProbeProps) {
  const commits = useRef(0);
  // Running total: iOS can drop a log line under load, and the next line still carries the count
  const total = useRef(0);
  const uiFrames = useSharedValue(0);

  // Runs on the UI thread, so it counts real UI frames, not JS ones
  useFrameCallback(() => {
    uiFrames.value += 1;
  });

  useEffect(() => {
    let jsFrames = 0;
    let raf = 0;
    const tick = () => {
      jsFrames += 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const timer = setInterval(() => {
      console.log(`[perf] ${id} js=${jsFrames} ui=${uiFrames.value} commits=${commits.current} total=${total.current}`);
      jsFrames = 0;
      uiFrames.value = 0;
      commits.current = 0;
    }, 1000);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
    };
  }, [id, uiFrames]);

  return (
    <Profiler
      id={id}
      onRender={() => {
        commits.current += 1;
        total.current += 1;
      }}
    >
      {children}
    </Profiler>
  );
}

const Passthrough = ({ children }: PerfProbeProps) => <>{children}</>;

export const PerfProbe = ENABLED ? Probe : Passthrough;
