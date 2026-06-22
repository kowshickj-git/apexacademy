"use client";
import dynamic from "next/dynamic";

// Load the playground client-only: Monaco and the Wokwi custom elements both
// touch browser-only APIs and must not be server-rendered.
const ArduinoPlayground = dynamic(() => import("./ArduinoPlayground"), {
  ssr: false,
  loading: () => (
    <div className="h-[100dvh] w-screen grid place-items-center bg-[#050507] text-white/40 text-sm">
      Loading Arduino Playground…
    </div>
  ),
});

export default function PlaygroundClient() {
  return <ArduinoPlayground />;
}
