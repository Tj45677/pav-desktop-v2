"use client";

import { useEffect, useRef } from "react";

export default function UISounds() {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const keyAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickAudioRef.current = new Audio("/ui-click.wav");
    keyAudioRef.current = new Audio("/ui-key.wav");

    if (clickAudioRef.current) {
      clickAudioRef.current.volume = 0.35;
      clickAudioRef.current.preload = "auto";
    }

    if (keyAudioRef.current) {
      keyAudioRef.current.volume = 0.18;
      keyAudioRef.current.preload = "auto";
    }

    const playClick = () => {
      const base = clickAudioRef.current;
      if (!base) return;

      const sound = base.cloneNode() as HTMLAudioElement;
      sound.volume = base.volume;
      sound.currentTime = 0;
      void sound.play().catch(() => {});
    };

    const playKey = (event: KeyboardEvent) => {
      const ignoredKeys = [
        "Shift",
        "Control",
        "Alt",
        "Meta",
        "CapsLock",
        "Tab",
        "Escape",
      ];

      if (ignoredKeys.includes(event.key)) return;

      const base = keyAudioRef.current;
      if (!base) return;

      const sound = base.cloneNode() as HTMLAudioElement;
      sound.volume = base.volume;
      sound.currentTime = 0;
      void sound.play().catch(() => {});
    };

    document.addEventListener("mousedown", playClick);
    document.addEventListener("keydown", playKey);

    return () => {
      document.removeEventListener("mousedown", playClick);
      document.removeEventListener("keydown", playKey);
    };
  }, []);

  return null;
}