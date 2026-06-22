"use client";
// APEX Arduino Playground — powered by avr8js + @wokwi/elements (the same engine
// as avr8js-electron-playground), rebuilt as a native APEX Next.js route.
//
// Pipeline: Arduino C  →  Wokwi build service (hexi.wokwi.com)  →  Intel HEX
//           →  AVRRunner (avr8js ATmega328p)  →  GPIO/PORTB bit 5  →  wokwi-led.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { AVRRunner } from "@/lib/playground/engine/execute";
import { buildHex } from "@/lib/playground/engine/compile";
import { EXAMPLES, DEFAULT_EXAMPLE } from "@/lib/playground/examples";
import SensorPanel from "./SensorPanel";
import { SENSOR_MAP, defaultConfig, adcChannelOf, portBitOf, type SensorInstance, type OutputState, type DeviceHandle, type SensorConfig } from "@/lib/playground/sensors";
import { I2CBus } from "@/lib/playground/engine/i2c-bus";
import Breadboard from "./Breadboard";
import Oscilloscope from "./Oscilloscope";
import { ScopeSampler } from "@/lib/playground/engine/scope";
import { buildNetlist, type ManualWire, type DeviceNet } from "@/lib/playground/netlist";

type Mode = "edit" | "compiling" | "running" | "paused" | "error";
type LedEl = HTMLElement & { value: boolean };

const MODE_META: Record<Mode, { label: string; color: string }> = {
  edit: { label: "EDIT", color: "#fbbf24" },
  compiling: { label: "COMPILING", color: "#0ea5e9" },
  running: { label: "RUNNING", color: "#34d399" },
  paused: { label: "PAUSED", color: "#fb923c" },
  error: { label: "ERROR", color: "#f87171" },
};

const PIN_LABELS = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"];

export default function ArduinoPlayground() {
  const [code, setCode] = useState(DEFAULT_EXAMPLE.code);
  const [exampleId, setExampleId] = useState(DEFAULT_EXAMPLE.id);
  const [mode, setMode] = useState<Mode>("edit");
  const [serial, setSerial] = useState("");
  const [pins, setPins] = useState<boolean[]>(() => new Array(14).fill(false));
  const [error, setError] = useState<string | null>(null);
  const [elementsReady, setElementsReady] = useState(false);
  const [sensors, setSensors] = useState<SensorInstance[]>([]);
  const [outputs, setOutputs] = useState<Record<string, OutputState>>({});
  const [mainView, setMainView] = useState<"code" | "breadboard" | "scope">("code");
  const [manualWires, setManualWires] = useState<ManualWire[]>([]);
  const [bbWireColor, setBbWireColor] = useState("#fbbf24");
  const [showSuggested, setShowSuggested] = useState(true);
  const [wiredMode, setWiredMode] = useState(false);

  const netlist = useMemo(() => buildNetlist(sensors, manualWires), [sensors, manualWires]);
  const netlistRef = useRef<Record<string, DeviceNet>>({});
  const wiredModeRef = useRef(false);
  useEffect(() => {
    netlistRef.current = netlist;
  }, [netlist]);
  useEffect(() => {
    wiredModeRef.current = wiredMode;
  }, [wiredMode]);

  const runnerRef = useRef<AVRRunner | null>(null);
  const hexRef = useRef<string | null>(null);
  const ledRef = useRef<HTMLElement | null>(null);
  const serialRef = useRef("");
  const lastPackedRef = useRef(-1);
  const sensorsRef = useRef<SensorInstance[]>([]);
  const handlesRef = useRef<Record<string, DeviceHandle>>({});
  const frameRef = useRef(0);
  const i2cBusRef = useRef<I2CBus | null>(null);
  const scopeSamplerRef = useRef<ScopeSampler | null>(null);
  const lastMotionRef = useRef(0);
  const orientationRef = useRef({ beta: 0, gamma: 0 });
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });

  // Keep a ref in sync so the running simulation loop always sees the latest sensors.
  useEffect(() => {
    sensorsRef.current = sensors;
  }, [sensors]);

  // Live input: attach real browser sensors when any device is in Live mode.
  useEffect(() => {
    const motionLive = sensors.some((s) => s.live && SENSOR_MAP[s.defId]?.liveInput === "motion");
    const orientLive = sensors.some((s) => s.live && SENSOR_MAP[s.defId]?.liveInput === "orientation");
    if (!motionLive && !orientLive) return;
    const onMove = () => {
      lastMotionRef.current = performance.now();
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      orientationRef.current = { beta: e.beta ?? 0, gamma: e.gamma ?? 0 };
    };
    const onMotion = (e: DeviceMotionEvent) => {
      const r = e.rotationRate;
      if (r) rotationRef.current = { x: r.beta ?? 0, y: r.gamma ?? 0, z: r.alpha ?? 0 };
    };
    if (motionLive) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
    }
    if (orientLive) {
      window.addEventListener("deviceorientation", onOrient);
      window.addEventListener("devicemotion", onMotion);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [sensors]);

  // Register the Wokwi custom elements (browser-only: they call customElements.define).
  useEffect(() => {
    let active = true;
    import("@wokwi/elements").then(() => active && setElementsReady(true)).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Tear down the simulator on unmount.
  useEffect(() => () => runnerRef.current?.stop(), []);

  const setLed = useCallback((on: boolean) => {
    if (ledRef.current) (ledRef.current as LedEl).value = on;
  }, []);

  const readCpu = useCallback(() => {
    const runner = runnerRef.current;
    if (!runner) return;

    // In "wired mode" the simulation follows the breadboard wires (netlist);
    // otherwise it follows the dropdown pin assignments.
    const wired = wiredModeRef.current;
    const nl = netlistRef.current;

    // Live-input override: real mouse/touch motion or device tilt/rotation.
    const effCfg = (inst: SensorInstance): SensorConfig => {
      if (!inst.live) return inst.config;
      const d = SENSOR_MAP[inst.defId];
      if (d?.liveInput === "motion") {
        return { ...inst.config, motion: performance.now() - lastMotionRef.current < 800 };
      }
      if (d?.liveInput === "orientation") {
        const b = (orientationRef.current.beta * Math.PI) / 180;
        const g = (orientationRef.current.gamma * Math.PI) / 180;
        const r = rotationRef.current;
        return { ...inst.config, ax: Math.sin(g), ay: Math.sin(b), az: Math.cos(b) * Math.cos(g), gx: r.x, gy: r.y, gz: r.z };
      }
      return inst.config;
    };

    // 1) Analog/digital inputs: inject physically-modelled values each frame
    //    (analog → ADC channel for analogRead, digital → input pin for digitalRead).
    for (const s of sensorsRef.current) {
      const def = SENSOR_MAP[s.defId];
      if (!def?.compute) continue;
      const dn = nl[s.instanceId];
      if (wired && !dn?.powered) continue; // unpowered → floating, no signal
      const pin = wired ? dn?.pins.pin : s.pins.pin;
      if (!pin) continue; // signal not connected
      const r = def.compute(effCfg(s));
      if (def.kind === "analog" && r.adc != null) {
        const ch = adcChannelOf(pin);
        if (ch >= 0) runner.adcRegistry.setValue(ch, r.adc);
      } else if (def.kind === "digital" && r.digital != null) {
        const pb = portBitOf(pin);
        if (pb) runner[pb.port].setPin(pb.bit, r.digital);
      }
    }

    // 2) Protocol / output / I2C devices: lazily attach their real models, keep config live.
    const i2cBus = i2cBusRef.current;
    for (const s of sensorsRef.current) {
      const def = SENSOR_MAP[s.defId];
      if (!def || (def.kind !== "protocol" && def.kind !== "output" && def.kind !== "i2c")) continue;
      const dn = nl[s.instanceId];
      if (wired) {
        if (def.kind === "i2c") {
          if (!dn?.i2cOk) continue; // wrong/missing I2C wiring → device silent
        } else if (!dn?.powered) continue; // unpowered → does nothing
      }
      const pins = wired ? dn?.pins ?? {} : s.pins;
      if (def.attach && !handlesRef.current[s.instanceId] && i2cBus) {
        handlesRef.current[s.instanceId] = def.attach(
          { runner, i2cBus, millis: () => runner.cpu.cycles / (runner.frequency / 1000) },
          pins,
          effCfg(s),
        );
      }
      handlesRef.current[s.instanceId]?.update?.(effCfg(s));
    }

    // 3) Throttled (~12 Hz) readout for the UI (servo angle, motor %, LCD text, OLED pixels, …).
    frameRef.current++;
    const hasReadable = sensorsRef.current.some((s) => {
      const k = SENSOR_MAP[s.defId]?.kind;
      return k === "output" || k === "i2c";
    });
    if (frameRef.current % 5 === 0 && hasReadable) {
      const o: Record<string, OutputState> = {};
      for (const s of sensorsRef.current) {
        const def = SENSOR_MAP[s.defId];
        if (def?.kind !== "output" && def?.kind !== "i2c") continue;
        const st = def.readStateless ? def.readStateless(runner, s.pins, s.config) : handlesRef.current[s.instanceId]?.read?.();
        if (st) o[s.instanceId] = st;
      }
      setOutputs(o);
    }

    const portB = runner.getPortOutputValue("B");
    const portD = runner.getPortOutputValue("D");
    setLed((portB & (1 << 5)) !== 0); // pin 13 = PB5
    const packed = (portD & 0xff) | ((portB & 0x3f) << 8);
    if (packed !== lastPackedRef.current) {
      lastPackedRef.current = packed;
      const next: boolean[] = [];
      for (let d = 0; d < 8; d++) next.push((portD & (1 << d)) !== 0);
      for (let b = 0; b < 6; b++) next.push((portB & (1 << b)) !== 0);
      setPins(next);
    }
  }, [setLed]);

  const startRunner = useCallback(
    (hex: string) => {
      runnerRef.current?.stop();
      const runner = new AVRRunner(hex);
      runnerRef.current = runner;
      hexRef.current = hex;
      serialRef.current = "";
      setSerial("");
      lastPackedRef.current = -1;
      handlesRef.current = {};
      frameRef.current = 0;
      i2cBusRef.current = new I2CBus(runner.twi);
      scopeSamplerRef.current = new ScopeSampler(runner);
      setOutputs({});
      runner.usart.onByteTransmit = (b: number) => {
        serialRef.current = (serialRef.current + String.fromCharCode(b)).slice(-6000);
        setSerial(serialRef.current);
      };
      runner.execute(() => readCpu());
      setMode("running");
    },
    [readCpu],
  );

  const compileAndRun = useCallback(async () => {
    setError(null);
    setMode("compiling");
    try {
      const result = await buildHex(code, []);
      if (!result.hex || !result.hex.trim()) {
        setError(result.stderr || "Compilation produced no output.");
        setMode("error");
        return;
      }
      startRunner(result.hex);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compilation failed (network or compiler error).");
      setMode("error");
    }
  }, [code, startRunner]);

  const pause = useCallback(() => {
    runnerRef.current?.pause();
    setMode("paused");
  }, []);

  const resume = useCallback(() => {
    runnerRef.current?.resume();
    setMode("running");
  }, []);

  const stop = useCallback(() => {
    runnerRef.current?.stop();
    runnerRef.current = null;
    handlesRef.current = {};
    i2cBusRef.current = null;
    scopeSamplerRef.current?.stop();
    scopeSamplerRef.current = null;
    setOutputs({});
    setLed(false);
    setPins(new Array(14).fill(false));
    lastPackedRef.current = -1;
    setMode("edit");
  }, [setLed]);

  const reset = useCallback(() => {
    if (hexRef.current) startRunner(hexRef.current);
  }, [startRunner]);

  const pickExample = useCallback(
    (id: string) => {
      runnerRef.current?.stop();
      runnerRef.current = null;
      const ex = EXAMPLES.find((e) => e.id === id) ?? DEFAULT_EXAMPLE;
      setExampleId(id);
      setCode(ex.code);
      setSerial("");
      setError(null);
      setLed(false);
      setPins(new Array(14).fill(false));
      setMode("edit");
    },
    [setLed],
  );

  const addSensor = useCallback((defId: string) => {
    const def = SENSOR_MAP[defId];
    if (!def) return;
    setSensors((prev) => [
      ...prev,
      { instanceId: `${defId}_${Date.now().toString(36)}_${prev.length}`, defId, pins: { ...def.defaultPins }, config: defaultConfig(def) },
    ]);
  }, []);
  const removeSensor = useCallback((id: string) => {
    delete handlesRef.current[id];
    setSensors((prev) => prev.filter((s) => s.instanceId !== id));
    setManualWires((prev) => prev.filter((w) => !w.a.startsWith(`dev:${id}:`) && !w.b.startsWith(`dev:${id}:`)));
  }, []);

  const addWire = useCallback(
    (a: string, b: string) =>
      setManualWires((prev) =>
        prev.some((w) => (w.a === a && w.b === b) || (w.a === b && w.b === a))
          ? prev
          : [...prev, { id: `w_${Date.now().toString(36)}_${prev.length}`, a, b, color: bbWireColor }],
      ),
    [bbWireColor],
  );
  const deleteWire = useCallback((id: string) => setManualWires((prev) => prev.filter((w) => w.id !== id)), []);
  const clearWires = useCallback(() => setManualWires([]), []);
  const setSensorPin = useCallback(
    (id: string, slot: string, pin: string) => {
      // Pin re-wiring for protocol/output devices takes effect on the next Run.
      delete handlesRef.current[id];
      setSensors((prev) => prev.map((s) => (s.instanceId === id ? { ...s, pins: { ...s.pins, [slot]: pin } } : s)));
    },
    [],
  );
  const setSensorConfig = useCallback(
    (id: string, key: string, value: number | boolean) =>
      setSensors((prev) => prev.map((s) => (s.instanceId === id ? { ...s, config: { ...s.config, [key]: value } } : s))),
    [],
  );
  const useExample = useCallback((id: string) => {
    const s = sensorsRef.current.find((x) => x.instanceId === id);
    const def = s ? SENSOR_MAP[s.defId] : undefined;
    if (s && def) setCode(def.example(s.pins));
  }, []);
  const setLive = useCallback((id: string, live: boolean) => {
    setSensors((prev) => prev.map((s) => (s.instanceId === id ? { ...s, live } : s)));
    // iOS requires an explicit permission request from a user gesture.
    if (live && typeof window !== "undefined") {
      const D = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      D?.requestPermission?.().catch(() => {});
      const M = window.DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
      M?.requestPermission?.().catch(() => {});
    }
  }, []);

  const meta = MODE_META[mode];
  const busy = mode === "compiling";
  const live = mode === "running" || mode === "paused";

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-[#050507] text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-14 border-b border-white/10 bg-[#0d0d12] shrink-0 overflow-x-auto">
        <a href="/index.html" className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/10 whitespace-nowrap">
          ← APEX
        </a>
        <span className="font-bold text-sm whitespace-nowrap mr-1">
          🔌 Arduino <span className="text-primary">Playground</span>
        </span>
        <span
          className="px-2 py-1 rounded-md text-[10px] font-bold font-mono tracking-wider whitespace-nowrap shrink-0"
          style={{ color: meta.color, background: `${meta.color}1f`, border: `1px solid ${meta.color}55` }}
        >
          ● {meta.label}
        </span>

        <span className="w-px h-6 bg-white/10 shrink-0" />

        {!live ? (
          <button
            onClick={compileAndRun}
            disabled={busy}
            className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
          >
            {busy ? "⏳ Compiling…" : "▶ Compile & Run"}
          </button>
        ) : (
          <>
            {mode === "running" ? (
              <button onClick={pause} className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-amber-500/15 text-amber-400 hover:bg-amber-500/25">
                ⏸ Pause
              </button>
            ) : (
              <button onClick={resume} className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25">
                ▶ Resume
              </button>
            )}
            <button onClick={reset} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 whitespace-nowrap">
              ↺ Reset
            </button>
            <button onClick={stop} className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-red-500/15 text-red-400 hover:bg-red-500/25">
              ■ Stop
            </button>
          </>
        )}

        <span className="w-px h-6 bg-white/10 shrink-0" />
        <span className="text-[10px] text-white/40 whitespace-nowrap">Example</span>
        <select
          value={exampleId}
          onChange={(e) => pickExample(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
        >
          {EXAMPLES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <span className="w-px h-6 bg-white/10 shrink-0 ml-auto" />
        <div className="flex rounded-lg overflow-hidden border border-white/10 shrink-0">
          <button
            onClick={() => setMainView("code")}
            className={`px-2.5 py-1.5 text-xs font-semibold ${mainView === "code" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
          >
            ‹ › Code
          </button>
          <button
            onClick={() => setMainView("breadboard")}
            className={`px-2.5 py-1.5 text-xs font-semibold ${mainView === "breadboard" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
          >
            ⊞ Breadboard
          </button>
          <button
            onClick={() => setMainView("scope")}
            className={`px-2.5 py-1.5 text-xs font-semibold ${mainView === "scope" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
          >
            📈 Scope
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Editor / Breadboard */}
        <div className="flex-1 min-w-0 min-h-0 border-b lg:border-b-0 lg:border-r border-white/10">
          {mainView === "code" ? (
            <Editor
              height="100%"
              defaultLanguage="cpp"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontFamily: "var(--font-mono, monospace)",
                padding: { top: 12 },
                automaticLayout: true,
              }}
            />
          ) : mainView === "scope" ? (
            <Oscilloscope samplerRef={scopeSamplerRef} running={live} />
          ) : (
            <Breadboard
              sensors={sensors}
              manualWires={manualWires}
              wireColor={bbWireColor}
              showSuggested={showSuggested}
              wiredMode={wiredMode}
              netlist={netlist}
              onAddWire={addWire}
              onDeleteWire={deleteWire}
              onClearWires={clearWires}
              onSetWireColor={setBbWireColor}
              onToggleSuggested={() => setShowSuggested((v) => !v)}
              onToggleWired={() => setWiredMode((v) => !v)}
            />
          )}
        </div>

        {/* Board + pins */}
        <div className="w-full lg:w-[420px] shrink-0 overflow-y-auto bg-[#0a0a0e] p-4 flex flex-col gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Arduino Uno</p>
            <div className="rounded-xl border border-white/10 bg-[#0d0d12] p-4 flex flex-col items-center gap-4">
              <div style={{ width: 280 }}>{elementsReady ? <wokwi-arduino-uno /> : <div className="h-40 grid place-items-center text-white/30 text-xs">Loading board…</div>}</div>
              <div className="flex items-center gap-3">
                {elementsReady && <wokwi-led ref={ledRef} color="red" label="13" />}
                <div className="text-xs">
                  <p className="font-semibold text-white">On-board LED</p>
                  <p className="font-mono text-white/40">Pin 13 · PB5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital pin monitor */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono mb-2">Digital pins (live)</p>
            <div className="grid grid-cols-7 gap-1.5">
              {PIN_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="rounded-md border text-center py-1.5 transition-colors"
                  style={{
                    borderColor: pins[i] ? "#34d39955" : "rgba(255,255,255,0.08)",
                    background: pins[i] ? "rgba(52,211,153,0.18)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="block text-[9px] font-mono text-white/50">{label}</span>
                  <span className="block text-[10px] font-bold font-mono" style={{ color: pins[i] ? "#34d399" : "rgba(255,255,255,0.3)" }}>
                    {pins[i] ? "HIGH" : "LOW"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sensors & modules */}
          <SensorPanel
            sensors={sensors}
            outputs={outputs}
            onAdd={addSensor}
            onRemove={removeSensor}
            onPin={setSensorPin}
            onConfig={setSensorConfig}
            onUseExample={useExample}
            onSetLive={setLive}
          />
        </div>
      </div>

      {/* Serial monitor */}
      <div className="h-36 shrink-0 border-t border-white/10 bg-[#0a0a0e] flex flex-col">
        <div className="flex items-center gap-3 px-3 py-1.5 border-b border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Serial Monitor</p>
          <span className="text-[10px] font-mono" style={{ color: meta.color }}>● {meta.label}</span>
          <span className="text-[10px] font-mono text-white/30">115200 baud</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[11px] whitespace-pre-wrap text-emerald-300/90">
          {error ? <span className="text-red-400">{error}</span> : serial || <span className="text-white/30">Serial output appears here when you Compile &amp; Run…</span>}
        </div>
      </div>
    </div>
  );
}
