// JSX typings for the @wokwi/elements custom elements used in the playground.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type WC<P = Record<string, never>> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & P;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wokwi-arduino-uno": WC;
      "wokwi-led": WC<{ value?: boolean; color?: string; brightness?: number; label?: string; flip?: boolean }>;
      "wokwi-pushbutton": WC<{ color?: string; label?: string }>;
      "wokwi-resistor": WC<{ value?: string }>;
    }
  }
}
