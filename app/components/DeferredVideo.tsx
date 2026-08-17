"use client";

import { useEffect, useRef, useState } from "react";

type DeferredVideoProps = {
  src: string;
  className?: string;
};

export function DeferredVideo({ src, className }: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={shouldLoad ? src : undefined}
      autoPlay={shouldLoad}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
