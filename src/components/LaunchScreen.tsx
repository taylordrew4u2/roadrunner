"use client";
import { motion } from "framer-motion";

export default function LaunchScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <motion.div
        className="w-20 h-20 rounded-full bg-blue-500"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
    </div>
  );
}
