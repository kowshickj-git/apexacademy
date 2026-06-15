import { MetadataRoute } from "next";

const BASE = "https://apexacademy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
    "/lessons/voltage",
    "/lessons/current",
    "/electronics/resistance",
    "/electronics/resistors",
    "/electronics/ohms-law",
    "/electronics/capacitors",
    "/electronics/diodes",
    "/electronics/leds",
    "/electronics/breadboards",
    "/electronics/multimeter",
    "/electronics/series-circuits",
    "/electronics/parallel-circuits",
    "/electronics/switches",
    "/electronics/pullup-pulldown",
    "/electronics/inductors",
    "/electronics/transformers",
    "/electronics/bjt",
    "/electronics/mosfet",
    "/electronics/logic-gates",
    "/electronics/arduino",
  ];

  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "/" ? 1 : 0.8,
  }));
}
