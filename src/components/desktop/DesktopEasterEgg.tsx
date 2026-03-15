"use client";

import { useState } from "react";

const images = [
  "/logo1.png",
  "/logo2.png",
  "/logo3.png",
];

export default function DesktopEasterEgg() {
  const [index, setIndex] = useState(0);

const handleClick = async () => {
  const next = (index + 1) % images.length;
  setIndex(next);

  const audioContext = new AudioContext();

  const response = await fetch("/egg.wav");
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;


  source.detune.value = (Math.random() - 0.5) * 200;

  source.connect(audioContext.destination);
  source.start();
};

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "64px",
        right: "20px",
        cursor: "pointer",
        userSelect: "none",
        zIndex: 9999,
      }}
    >
      <img
        src={images[index]}
        alt="logo"
        style={{
            width: "auto",
            height: "auto",
            maxWidth: "160px",
            maxHeight: "160px",
            display: "block",
        }}
      />
    </div>
  );
}