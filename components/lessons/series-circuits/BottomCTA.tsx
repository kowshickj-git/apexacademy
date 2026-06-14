"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BottomCTA() {
  return (
    <section className="px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Divider */}
        <div
          className="h-px mb-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)" }}
        />

        {/* Navigation buttons */}
        <div className="flex gap-4 justify-between flex-wrap">
          {/* Prev */}
          <Link
            href="/electronics/multimeter"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(240,240,245,0.55)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Multimeter
          </Link>

          {/* Back to home */}
          <Link
            href="/"
            className="text-sm px-4 py-3 rounded-2xl transition-all hover:opacity-80"
            style={{ color: "rgba(240,240,245,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            Back to APEX Academy
          </Link>

          {/* Next */}
          <Link
            href="/electronics/parallel-circuits"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "1.5px solid rgba(249,115,22,0.35)",
              color: "#F97316",
              boxShadow: "0 0 16px rgba(249,115,22,0.1)",
            }}
          >
            Parallel Circuits
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center mt-8 text-xs" style={{ color: "rgba(240,240,245,0.2)" }}>
          Lesson 11 of 12 · Electronics Fundamentals · APEX Academy
        </p>
      </motion.div>
    </section>
  );
}
