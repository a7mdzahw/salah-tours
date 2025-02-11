"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
}

export default function Loader({ size = "medium", text = "Loading..." }: LoaderProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer rotating circle */}
        <motion.div
          className="absolute inset-0 border-4 border-primary-200 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Inner compass points */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-1/2 h-1/2">
            {/* North */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-500 rounded" />
            {/* South */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-primary-300 rounded" />
            {/* East */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 h-1 w-3 bg-primary-400 rounded" />
            {/* West */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1 w-3 bg-primary-400 rounded" />
          </div>
        </motion.div>
      </div>
      
      {/* Loading text with fade effect */}
      <motion.p
        className="text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.p>
    </div>
  );
} 