"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Props { onUsed: () => void; }

const COLOR = "#10B981";

interface Message {
  type: "sent" | "received" | "system";
  text: string;
  timestamp: string;
}

const ARDUINO_CODE = `void setup() {
  Serial.begin(115200);
  Serial.println("Hello from Arduino! Ready.");
}

void loop() {
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    if (cmd == "hello")
      Serial.println("Hello from Arduino! (UART L23)");
    else if (cmd == "temp")
      Serial.println("Temperature: 23.5°C (LM35)");
    else if (cmd == "led on")
      Serial.println("LED_BUILTIN is ON");
    else if (cmd == "led off")
      Serial.println("LED_BUILTIN is OFF");
    else if (cmd == "status")
      Serial.println("System OK. Uptime: 42s.");
    else if (cmd == "help")
      Serial.println("Commands: hello, temp, led on, led off, status, blink");
    else if (cmd == "blink")
      Serial.println("Blinking LED 5 times...");
    else
      Serial.println("Unknown command. Type 'help'.");
  }
}`;

function getTimestamp(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")}.${now.getMilliseconds().toString().padStart(3,"0")}`;
}

function getArduinoResponse(cmd: string): string {
  const c = cmd.toLowerCase().trim();
  if (c === "hello") return "Hello from Arduino! (UART L23)";
  if (c === "temp") return "Temperature: 23.5°C (LM35 sensor)";
  if (c === "led on") return "LED_BUILTIN is ON";
  if (c === "led off") return "LED_BUILTIN is OFF";
  if (c === "status") return "System OK. Uptime: 42s. Free RAM: 1024 bytes";
  if (c === "help") return "Commands: hello, temp, led on, led off, status, blink";
  if (c === "blink") return "Blinking LED 5 times...";
  return "Unknown command. Type 'help' for available commands.";
}

export default function SerialMonitor({ onUsed }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { type: "system", text: "Serial port opened at 115200 baud", timestamp: getTimestamp() },
    { type: "system", text: "8N1 · DTR: enabled · RTS: enabled", timestamp: getTimestamp() },
    { type: "received", text: "Hello from Arduino! Ready.", timestamp: getTimestamp() },
    { type: "system", text: "Type a command and press Send or Enter", timestamp: getTimestamp() },
  ]);
  const [input, setInput] = useState("");
  const [showCode, setShowCode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    if (!calledRef.current) { calledRef.current = true; onUsed(); }
    const ts = getTimestamp();
    const cmd = input.trim();
    const response = getArduinoResponse(cmd);
    setMessages(prev => [
      ...prev,
      { type: "sent", text: cmd, timestamp: ts },
      { type: "received", text: response, timestamp: getTimestamp() },
    ]);
    setInput("");
  }, [input, onUsed]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSend();
  }

  const MSG_COLORS: Record<string, string> = {
    sent: COLOR,
    received: "#93C5FD",
    system: "rgba(240,240,245,0.3)",
  };

  const MSG_PREFIX: Record<string, string> = {
    sent: "→",
    received: "←",
    system: "//",
  };

  return (
    <section className="border-b border-white/5 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 07 · Serial Monitor</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: "#F0F0F5" }}>Arduino Serial Monitor Simulator</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>
          Interact with a simulated Arduino over UART. Try commands: <span style={{ color: COLOR }}>hello</span>, <span style={{ color: COLOR }}>temp</span>, <span style={{ color: COLOR }}>led on</span>, <span style={{ color: COLOR }}>status</span>, <span style={{ color: COLOR }}>help</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
          className="lg:col-span-3 rounded-2xl border overflow-hidden flex flex-col"
          style={{ background: "#0a0a0f", borderColor: "rgba(16,185,129,0.25)" }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLOR }} />
            <span className="ml-2 text-[10px] font-mono" style={{ color: "rgba(240,240,245,0.3)" }}>
              Serial Monitor — COM3 — 115200 baud
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs" style={{ minHeight: "240px", maxHeight: "320px" }}>
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-6 text-right" style={{ color: MSG_COLORS[msg.type] }}>
                  {MSG_PREFIX[msg.type]}
                </span>
                <span className="flex-shrink-0 text-[9px]" style={{ color: "rgba(240,240,245,0.2)", paddingTop: "1px" }}>
                  {msg.timestamp}
                </span>
                <span style={{ color: msg.type === "sent" ? COLOR : msg.type === "received" ? "#93C5FD" : "rgba(240,240,245,0.3)" }}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command and press Enter..."
              className="flex-1 px-3 py-2 rounded-lg text-xs font-mono border outline-none"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(16,185,129,0.2)", color: "#F0F0F5" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
              style={{ background: `linear-gradient(135deg, ${COLOR}, #34D399)`, color: "white" }}
            >
              Send
            </button>
          </div>
        </motion.div>

        {/* Arduino code panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ background: "rgba(0,0,0,0.25)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b cursor-pointer"
            style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            onClick={() => setShowCode(v => !v)}
          >
            <span className="text-[10px] font-mono font-bold" style={{ color: COLOR }}>Arduino Sketch</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showCode ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <path d="M2 4l4 4 4-4" stroke="rgba(240,240,245,0.4)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          {showCode && (
            <pre className="p-4 text-[9px] font-mono overflow-x-auto" style={{ color: "rgba(240,240,245,0.6)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {ARDUINO_CODE}
            </pre>
          )}
          {!showCode && (
            <div className="p-4 space-y-2">
              {[
                { cmd: "hello", resp: "Hello from Arduino!" },
                { cmd: "temp", resp: "Temperature: 23.5°C" },
                { cmd: "led on", resp: "LED_BUILTIN is ON" },
                { cmd: "led off", resp: "LED_BUILTIN is OFF" },
                { cmd: "status", resp: "System OK. Uptime: 42s." },
                { cmd: "blink", resp: "Blinking LED 5 times..." },
                { cmd: "help", resp: "Commands: hello, temp..." },
              ].map(item => (
                <button
                  key={item.cmd}
                  onClick={() => { setInput(item.cmd); }}
                  className="w-full text-left px-3 py-2 rounded-lg border text-[10px] transition-all hover:opacity-80"
                  style={{ borderColor: "rgba(16,185,129,0.15)", background: "rgba(16,185,129,0.04)", color: "rgba(240,240,245,0.6)" }}
                >
                  <span className="font-mono font-bold" style={{ color: COLOR }}>{item.cmd}</span>
                  <span style={{ color: "rgba(240,240,245,0.3)" }}> → </span>
                  <span>{item.resp}</span>
                </button>
              ))}
              <button
                onClick={() => setShowCode(true)}
                className="w-full text-center py-2 text-[10px] rounded-lg border transition-all hover:opacity-80 mt-1"
                style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(240,240,245,0.3)" }}
              >
                View Arduino code →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
