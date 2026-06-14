"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const apps = [
  { icon: "📱", title: "Smartphone Display", detail: "Modern phones use OLED (Organic LED) panels — each pixel is a tiny RGB LED trio. 6.1-inch iPhone display: 460 pixels/inch, each 3 sub-pixels = ~2.5 million individual LEDs." },
  { icon: "🚦", title: "Traffic Lights", detail: "LED traffic lights use 15–20W vs 150W for incandescent. They last 10+ years vs 1 year for bulbs, and are bright enough to see in full sunlight. Transition worldwide saved millions of tonnes of CO2." },
  { icon: "💡", title: "Home Lighting", detail: "A 10W LED bulb replaces a 60W incandescent. Same light output (800 lumens), 85% less electricity, 25x longer life. Colour temperature: 2700K warm white to 6500K daylight." },
  { icon: "🚗", title: "Car Headlamps", detail: "LED headlamps are 3x brighter than halogen, 50% more efficient, and last the lifetime of the car. Adaptive LED arrays can individually switch off pixels to avoid blinding oncoming drivers." },
  { icon: "📺", title: "TV Backlight", detail: "LCD TVs use LED arrays for backlighting. Mini-LED TVs use thousands of individual LEDs for local dimming zones — deep blacks and high brightness in the same frame." },
  { icon: "🌱", title: "Plant Grow Lights", detail: "Plants absorb red (660nm) for flowering and blue (450nm) for vegetation. LED grow lights target these exact wavelengths, using 50% less power than fluorescent grow lights." },
  { icon: "🏥", title: "Medical Phototherapy", detail: "Blue LEDs (460nm) treat neonatal jaundice — photons break down bilirubin through the skin. Red/infrared LEDs are used in low-level laser therapy (LLLT) for pain relief." },
  { icon: "📡", title: "LiDAR & Sensing", detail: "Pulsed infrared LEDs in LiDAR systems measure distance by timing light reflections. Used in self-driving cars, facial recognition (iPhone Face ID uses IR LED + dot projector)." },
  { icon: "🎮", title: "RGB Keyboard & Gaming", detail: "Gaming keyboards contain individually addressable RGB LEDs (like WS2812B) per key. Each LED contains 3 tiny dies (R/G/B) and a control IC in a 5×5mm package." },
  { icon: "⚡", title: "Optocouplers", detail: "An IR LED shines onto a photodetector across a gap — creating electrical isolation while passing signals. Protects microcontrollers from high-voltage circuits. Found in every industrial controller." },
];

export default function Applications() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-10 border-b border-white/5">
      <div className="max-w-2xl">
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 14 · Applications</p>
        <h2 className="text-xl font-bold mb-1">LEDs in the Real World</h2>
        <p className="text-white/45 text-sm mb-5 leading-relaxed">
          LEDs are in more places than you think. Tap any device to see the engineering details.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {apps.map((a, i) => (
            <button
              key={a.title}
              onClick={() => setActive(active === i ? null : i)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-center"
              style={active === i
                ? { background: "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.35)" }
                : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }
              }
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-[9px] text-white/50 font-medium leading-tight">{a.title}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-red-500/25 p-5"
              style={{ background: "rgba(239,68,68,0.07)" }}
            >
              <p className="text-sm font-bold text-red-300 mb-1.5">{apps[active].icon} {apps[active].title}</p>
              <p className="text-xs text-white/55 leading-relaxed">{apps[active].detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
