"use client";
import { motion } from "framer-motion";

export default function LaunchScreen() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-500 shadow-soft animate-pulseGlow"
        animate={{ scale: [1, 1.08, 1], rotate: [0, 120, 240, 360] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
      />
    </div>
  );
}
