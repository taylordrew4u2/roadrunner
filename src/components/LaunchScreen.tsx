"use client";
import { motion } from "framer-motion";

export default function LaunchScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-base">
      <motion.div
        className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-500 shadow-soft animate-pulseGlow"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 120, 240, 360] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
      />
    </div>
  );
}
