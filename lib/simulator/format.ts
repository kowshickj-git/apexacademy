// Human-friendly engineering-notation formatters for readouts.

export function fmtV(v: number): string {
  const a = Math.abs(v);
  if (a < 1e-9) return "0 V";
  if (a < 1) return `${(v * 1000).toFixed(0)} mV`;
  return `${v.toFixed(2)} V`;
}

export function fmtA(i: number): string {
  const a = Math.abs(i);
  if (a < 1e-9) return "0 A";
  if (a >= 1) return `${i.toFixed(2)} A`;
  if (a >= 1e-3) return `${(i * 1e3).toFixed(1)} mA`;
  return `${(i * 1e6).toFixed(0)} µA`;
}

export function fmtOhm(r: number): string {
  if (r >= 1e6) return `${(r / 1e6).toFixed(r % 1e6 === 0 ? 0 : 1)} MΩ`;
  if (r >= 1e3) return `${(r / 1e3).toFixed(r % 1e3 === 0 ? 0 : 1)} kΩ`;
  return `${r.toFixed(0)} Ω`;
}

export function fmtW(p: number): string {
  const a = Math.abs(p);
  if (a < 1e-9) return "0 W";
  if (a >= 1) return `${p.toFixed(2)} W`;
  if (a >= 1e-3) return `${(p * 1e3).toFixed(1)} mW`;
  return `${(p * 1e6).toFixed(0)} µW`;
}
