"use client";

import { useEffect, useRef, useState } from "react";

type DeferredVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  controls?: boolean;
  label?: string;
};

export function DeferredVideo({ src, className, poster, controls = false, label }: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [failed, setFailed] = useState(false);

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
      poster={poster}
      autoPlay={shouldLoad && !controls}
      muted
      loop
      playsInline
      preload={controls ? "metadata" : "none"}
      controls={controls && shouldLoad && !failed}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-media-status={failed ? "fallback" : shouldLoad ? "loading" : "deferred"}
      onCanPlay={() => setFailed(false)}
      onError={() => setFailed(true)}
    />
  );
}
