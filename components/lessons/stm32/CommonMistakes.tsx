"use client";
import { motion } from "framer-motion";

const MISTAKES = [
  {
    num: "01",
    title: "Forgetting to enable GPIO clock",
    wrong: "// Configure GPIO without enabling clock\nGPIO_InitStruct.Pin = GPIO_PIN_5;\nHAL_GPIO_Init(GPIOA, &GPIO_InitStruct);\n// Pin stays at 0, nothing works!",
    right: "// Always enable the clock FIRST\n__HAL_RCC_GPIOA_CLK_ENABLE();\nGPIO_InitStruct.Pin = GPIO_PIN_5;\nHAL_GPIO_Init(GPIOA, &GPIO_InitStruct);",
    body: "Every STM32 peripheral starts with its clock disabled by default to save power. You MUST call __HAL_RCC_GPIOx_CLK_ENABLE() before initializing any GPIO. The same applies to all peripherals: TIM, USART, SPI, I2C — each has its own RCC enable call.",
  },
  {
    num: "02",
    title: "APB1 max 42 MHz — not 84 MHz",
    wrong: "// Expecting TIM2 input = 168 MHz\n// Calculating baud for APB1 UART at 168 MHz\n// Result: wrong baud rate by 2x!",
    right: "// APB1 peripheral clock = SYSCLK/4 = 42 MHz\n// But TIM2-7 timers on APB1 get 2x = 84 MHz\n// USART2-5 on APB1 = 42 MHz (not 84!)\n// Always check the clock tree in CubeMX",
    body: "APB1 peripheral clock is limited to 42 MHz (with 168 MHz SYSCLK and /4 prescaler). Timers on APB1 are doubled to 84 MHz by hardware, but UART/SPI/I2C peripherals stay at 42 MHz. Getting this wrong causes incorrect baud rates and communication failures.",
  },
  {
    num: "03",
    title: "Incorrect baud rate from wrong clock config",
    wrong: "// Compiled with one clock tree\n// Loaded config that changes PLL\n// UART suddenly outputs garbage",
    right: "// Set baud rate AFTER configuring SystemClock\n// Verify in SystemClock_Config() match CubeMX\nSystemClock_Config(); // Must run first!\nMX_USART2_UART_Init(); // Then peripherals",
    body: "STM32 baud rate registers are calculated from the peripheral clock at init time. If the clock tree is misconfigured or SystemClock_Config() isn't called before peripheral init, the UART baud divider will be wrong. Always verify SYSCLK, AHB, and APB prescalers match your CubeMX configuration.",
  },
];

export default function CommonMistakes() {
  return (
    <section className="py-10 border-b border-white/5">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-2 font-mono">Section 09 · Mistakes</p>
        <h2 className="text-xl font-black mb-1" style={{ color: "#F0F0F5" }}>Common Mistakes</h2>
        <p className="text-sm mb-6" style={{ color: "rgba(240,240,245,0.4)" }}>These errors catch nearly every STM32 beginner. Avoid them from day one.</p>

        <div className="space-y-4">
          {MISTAKES.map((m, i) => (
            <motion.div
              key={m.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border p-5"
              style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.18)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono" style={{ color: "rgba(239,68,68,0.5)" }}>{m.num}</span>
                <h3 className="text-sm font-black" style={{ color: "#EF4444" }}>{m.title}</h3>
              </div>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(240,240,245,0.55)" }}>{m.body}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div className="text-[9px] font-mono mb-1.5" style={{ color: "#EF4444" }}>WRONG</div>
                  <pre className="text-[9px] font-mono whitespace-pre-wrap" style={{ color: "rgba(240,240,245,0.5)" }}>{m.wrong}</pre>
                </div>
                <div className="rounded-lg p-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div className="text-[9px] font-mono mb-1.5" style={{ color: "#10B981" }}>RIGHT</div>
                  <pre className="text-[9px] font-mono whitespace-pre-wrap" style={{ color: "rgba(240,240,245,0.5)" }}>{m.right}</pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
